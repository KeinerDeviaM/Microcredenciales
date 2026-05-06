package com.edtech.microcredenciales.dto;

import java.time.Instant;

public record AuthResponse(
    String token,
    String tokenType,
    String email,
    String fullName,
    String role,
    Instant expiresAt
) {
}
