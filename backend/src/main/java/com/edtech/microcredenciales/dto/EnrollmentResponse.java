package com.edtech.microcredenciales.dto;

import com.edtech.microcredenciales.entity.Enrollment;
import java.time.LocalDateTime;

public record EnrollmentResponse(
    Long id,
    CredentialResponse credential,
    String status,
    LocalDateTime enrolledAt,
    LocalDateTime issuedAt,
    LocalDateTime expiresAt,
    String verificationCode
) {
    public static EnrollmentResponse from(Enrollment enrollment) {
        return new EnrollmentResponse(
            enrollment.getId(),
            CredentialResponse.from(enrollment.getCredential()),
            enrollment.getStatus().name(),
            enrollment.getEnrolledAt(),
            enrollment.getIssuedAt(),
            enrollment.getExpiresAt(),
            enrollment.getVerificationCode()
        );
    }
}
