package com.edtech.microcredenciales.repository;

import com.edtech.microcredenciales.entity.AppUser;
import com.edtech.microcredenciales.entity.Enrollment;
import com.edtech.microcredenciales.entity.EnrollmentStatus;
import com.edtech.microcredenciales.entity.MicroCredential;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserOrderByEnrolledAtDesc(AppUser user);

    Optional<Enrollment> findByUserAndCredential(AppUser user, MicroCredential credential);

    long countByStatus(EnrollmentStatus status);
}
