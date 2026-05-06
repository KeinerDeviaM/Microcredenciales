package com.edtech.microcredenciales.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record CredentialRequest(
    @NotBlank String title,
    @NotBlank String businessArea,
    @NotBlank String level,
    @NotBlank String description,
    @NotNull @Min(1) Integer durationHours,
    @NotBlank String issuer,
    Set<String> skillTags,
    Boolean active
) {
}
