package com.edtech.microcredenciales.controller;

import com.edtech.microcredenciales.dto.CredentialRequest;
import com.edtech.microcredenciales.dto.CredentialResponse;
import com.edtech.microcredenciales.service.MicroCredentialService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {
    private final MicroCredentialService credentialService;

    public CredentialController(MicroCredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @GetMapping
    public List<CredentialResponse> findAll() {
        return credentialService.findAll();
    }

    @GetMapping("/{id}")
    public CredentialResponse findById(@PathVariable Long id) {
        return credentialService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CredentialResponse> create(@Valid @RequestBody CredentialRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(credentialService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CredentialResponse update(@PathVariable Long id, @Valid @RequestBody CredentialRequest request) {
        return credentialService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        credentialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
