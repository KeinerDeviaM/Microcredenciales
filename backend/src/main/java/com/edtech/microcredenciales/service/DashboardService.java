package com.edtech.microcredenciales.service;

import com.edtech.microcredenciales.dto.DashboardSummary;
import com.edtech.microcredenciales.entity.EnrollmentStatus;
import com.edtech.microcredenciales.repository.EnrollmentRepository;
import com.edtech.microcredenciales.repository.MicroCredentialRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final MicroCredentialRepository credentialRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DashboardService(MicroCredentialRepository credentialRepository, EnrollmentRepository enrollmentRepository) {
        this.credentialRepository = credentialRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public DashboardSummary summary() {
        return new DashboardSummary(
            credentialRepository.count(),
            enrollmentRepository.count(),
            enrollmentRepository.countByStatus(EnrollmentStatus.ISSUED),
            credentialRepository.findByActiveTrueOrderByCreatedAtDesc().size()
        );
    }
}
