package com.edtech.microcredenciales.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(min = 3, max = 120) String fullName,
    @Email @NotBlank String email,
    @NotBlank @Size(min = 6, max = 80) String password
) {
}
