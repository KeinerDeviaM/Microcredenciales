package com.edtech.microcredenciales.service;

import com.edtech.microcredenciales.dto.AuthRequest;
import com.edtech.microcredenciales.dto.AuthResponse;
import com.edtech.microcredenciales.dto.RegisterRequest;
import com.edtech.microcredenciales.entity.AppUser;
import com.edtech.microcredenciales.entity.Role;
import com.edtech.microcredenciales.repository.AppUserRepository;
import com.edtech.microcredenciales.security.JwtService;
import java.time.Instant;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
        AppUserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con ese correo");
        }

        AppUser user = new AppUser(
            request.fullName().trim(),
            email,
            passwordEncoder.encode(request.password()),
            Role.USER
        );
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer", user.getEmail(), user.getFullName(), user.getRole().name(), jwtService.extractExpiration(token));
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        AppUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
        String token = jwtService.generateToken(user);
        Instant expiresAt = jwtService.extractExpiration(token);
        return new AuthResponse(token, "Bearer", user.getEmail(), user.getFullName(), user.getRole().name(), expiresAt);
    }
}
