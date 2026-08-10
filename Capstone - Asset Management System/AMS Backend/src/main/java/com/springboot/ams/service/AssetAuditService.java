package com.springboot.ams.service;

import com.springboot.ams.dto.response.AuditRespDto;
import com.springboot.ams.enums.AuditStatus;
import com.springboot.ams.mapper.AuditMapper;
import com.springboot.ams.model.Asset;
import com.springboot.ams.model.AssetAllocation;
import com.springboot.ams.model.AssetAudit;
import com.springboot.ams.model.User;
import com.springboot.ams.repository.AssetAllocationRepository;
import com.springboot.ams.repository.AssetAuditRepository;
import com.springboot.ams.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetAuditService {

    private final AssetAuditRepository auditRepository;
    private final AssetAllocationRepository allocationRepository;
    private final UserRepository userRepository;
    private final AuditMapper auditMapper;

    // Admin will be sending audit request to every employee who has been allocated
    public List<AuditRespDto> sendAuditToAll() {
        List<AssetAllocation> activeAllocations = allocationRepository.findByReturnedFalse();
        List<AssetAudit> audits = new ArrayList<>();
        for (AssetAllocation allocation : activeAllocations) {
            AssetAudit audit = new AssetAudit();
            audit.setAsset(allocation.getAsset());
            audit.setEmployee(allocation.getEmployee());
            audit.setStatus(AuditStatus.PENDING);
            audits.add(audit);
        }
        List<AssetAudit> saved = auditRepository.saveAll(audits);
        List<AuditRespDto> result = new ArrayList<>();
        for (AssetAudit audit : saved) {
            result.add(auditMapper.entityToDto(audit));
        }
        return result;
    }

    // Admin - get all audits
    public List<AuditRespDto> getAllAudits() {
        return auditRepository.findAll()
                .stream()
                .map(auditMapper::entityToDto)
                .toList();
    }

    // Employee -get my pending audits
    public List<AuditRespDto> getMyAudits(String username) {
        User employee = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return auditRepository.findByEmployee(employee)
                .stream()
                .map(auditMapper::entityToDto)
                .toList();
    }

    // Employee - verify audit
    public AuditRespDto verifyAudit(int id) {
        AssetAudit audit = findById(id);
        audit.setStatus(AuditStatus.VERIFIED);
        audit.setVerifiedAt(Instant.now());
        return auditMapper.entityToDto(auditRepository.save(audit));
    }

    // Employee- reject audit
    public AuditRespDto rejectAudit(int id) {
        AssetAudit audit = findById(id);
        audit.setStatus(AuditStatus.REJECTED);
        audit.setVerifiedAt(Instant.now());
        return auditMapper.entityToDto(auditRepository.save(audit));
    }

    private AssetAudit findById(int id) {
        return auditRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Audit record not found with id: " + id));
    }
}
