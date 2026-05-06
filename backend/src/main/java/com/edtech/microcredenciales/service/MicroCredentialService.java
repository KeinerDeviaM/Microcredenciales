package com.edtech.microcredenciales.service;

import com.edtech.microcredenciales.dto.CredentialRequest;
import com.edtech.microcredenciales.dto.CredentialResponse;
import com.edtech.microcredenciales.entity.MicroCredential;
import com.edtech.microcredenciales.repository.MicroCredentialRepository;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MicroCredentialService {
    private final MicroCredentialRepository credentialRepository;

    public MicroCredentialService(MicroCredentialRepository credentialRepository) {
        this.credentialRepository = credentialRepository;
    }

    public List<CredentialResponse> findAll() {
        return credentialRepository.findAll().stream()
            .map(CredentialResponse::from)
            .toList();
    }

    public CredentialResponse findById(Long id) {
        return CredentialResponse.from(getCredential(id));
    }

    @Transactional
    public CredentialResponse create(CredentialRequest request) {
        MicroCredential credential = new MicroCredential();
        applyRequest(credential, request);
        return CredentialResponse.from(credentialRepository.save(credential));
    }

    @Transactional
    public CredentialResponse update(Long id, CredentialRequest request) {
        MicroCredential credential = getCredential(id);
        applyRequest(credential, request);
        return CredentialResponse.from(credentialRepository.save(credential));
    }

    @Transactional
    public void delete(Long id) {
        MicroCredential credential = getCredential(id);
        credentialRepository.delete(credential);
    }

    MicroCredential getCredential(Long id) {
        return credentialRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Micro-credencial no encontrada"));
    }

    private void applyRequest(MicroCredential credential, CredentialRequest request) {
        credential.setTitle(request.title().trim());
        credential.setBusinessArea(request.businessArea().trim());
        credential.setLevel(request.level().trim());
        credential.setDescription(request.description().trim());
        credential.setDurationHours(request.durationHours());
        credential.setIssuer(request.issuer().trim());
        credential.setActive(request.active() == null || request.active());
        Set<String> tags = request.skillTags() == null ? Set.of() : request.skillTags();
        credential.setSkillTags(tags.stream()
            .filter(tag -> tag != null && !tag.isBlank())
            .map(String::trim)
            .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)));
    }
}
