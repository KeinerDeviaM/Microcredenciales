package com.edtech.microcredenciales.repository;

import com.edtech.microcredenciales.entity.MicroCredential;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MicroCredentialRepository extends JpaRepository<MicroCredential, Long> {
    List<MicroCredential> findByActiveTrueOrderByCreatedAtDesc();
}
