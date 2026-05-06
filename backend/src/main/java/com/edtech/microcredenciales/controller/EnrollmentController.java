package com.edtech.microcredenciales.controller;

import com.edtech.microcredenciales.dto.EnrollmentRequest;
import com.edtech.microcredenciales.dto.EnrollmentResponse;
import com.edtech.microcredenciales.service.EnrollmentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/me")
    public List<EnrollmentResponse> findMine() {
        return enrollmentService.findMine();
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponse> enroll(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.enroll(request.credentialId()));
    }

    @PatchMapping("/{id}/complete")
    public EnrollmentResponse complete(@PathVariable Long id) {
        return enrollmentService.complete(id);
    }
}
