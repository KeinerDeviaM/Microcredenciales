package com.edtech.microcredenciales.service;

import com.edtech.microcredenciales.dto.EnrollmentResponse;
import com.edtech.microcredenciales.entity.AppUser;
import com.edtech.microcredenciales.entity.Enrollment;
import com.edtech.microcredenciales.entity.EnrollmentStatus;
import com.edtech.microcredenciales.entity.MicroCredential;
import com.edtech.microcredenciales.repository.AppUserRepository;
import com.edtech.microcredenciales.repository.EnrollmentRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final AppUserRepository userRepository;
    private final MicroCredentialService credentialService;

    public EnrollmentService(
        EnrollmentRepository enrollmentRepository,
        AppUserRepository userRepository,
        MicroCredentialService credentialService
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.credentialService = credentialService;
    }

    public List<EnrollmentResponse> findMine() {
        AppUser user = currentUser();
        return enrollmentRepository.findByUserOrderByEnrolledAtDesc(user).stream()
            .map(EnrollmentResponse::from)
            .toList();
    }

    @Transactional
    public EnrollmentResponse enroll(Long credentialId) {
        AppUser user = currentUser();
        MicroCredential credential = credentialService.getCredential(credentialId);
        if (!credential.isActive()) {
            throw new IllegalArgumentException("La micro-credencial no está activa");
        }
        enrollmentRepository.findByUserAndCredential(user, credential).ifPresent(existing -> {
            throw new IllegalArgumentException("Ya estás inscrito en esta micro-credencial");
        });

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCredential(credential);
        enrollment.setStatus(EnrollmentStatus.IN_PROGRESS);
        return EnrollmentResponse.from(enrollmentRepository.save(enrollment));
    }

    @Transactional
    public EnrollmentResponse complete(Long enrollmentId) {
        AppUser user = currentUser();
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new IllegalArgumentException("Inscripción no encontrada"));
        if (!enrollment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("No puedes completar una inscripción de otro usuario");
        }
        enrollment.setStatus(EnrollmentStatus.ISSUED);
        enrollment.setIssuedAt(LocalDateTime.now());
        enrollment.setExpiresAt(LocalDateTime.now().plusYears(2));
        enrollment.setVerificationCode("MC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return EnrollmentResponse.from(enrollmentRepository.save(enrollment));
    }

    private AppUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("Usuario no autenticado");
        }
        return userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no existe"));
    }
}
