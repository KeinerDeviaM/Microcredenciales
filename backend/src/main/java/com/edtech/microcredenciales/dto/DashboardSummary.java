package com.edtech.microcredenciales.dto;

public record DashboardSummary(
    long totalCredentials,
    long totalEnrollments,
    long issuedCredentials,
    long activeCredentials
) {
}
