package com.edtech.microcredenciales.dto;

import com.edtech.microcredenciales.entity.MicroCredential;
import java.time.LocalDateTime;
import java.util.Set;

public record CredentialResponse(
    Long id,
    String title,
    String businessArea,
    String level,
    String description,
    Integer durationHours,
    String issuer,
    Set<String> skillTags,
    boolean active,
    LocalDateTime createdAt
) {
    public static CredentialResponse from(MicroCredential credential) {
        return new CredentialResponse(
            credential.getId(),
            credential.getTitle(),
            credential.getBusinessArea(),
            credential.getLevel(),
            credential.getDescription(),
            credential.getDurationHours(),
            credential.getIssuer(),
            credential.getSkillTags(),
            credential.isActive(),
            credential.getCreatedAt()
        );
    }
}
