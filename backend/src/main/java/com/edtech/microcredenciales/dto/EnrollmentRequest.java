package com.edtech.microcredenciales.dto;

import jakarta.validation.constraints.NotNull;

public record EnrollmentRequest(
    @NotNull Long credentialId
) {
}
