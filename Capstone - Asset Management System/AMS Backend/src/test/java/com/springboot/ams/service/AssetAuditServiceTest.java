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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetAuditServiceTest {

    @Mock
    private AssetAuditRepository auditRepository;

    @Mock
    private AssetAllocationRepository allocationRepository;

    @Mock
    private UserRepository userRepository;

    @Spy
    private AuditMapper auditMapper = new AuditMapper();

    @InjectMocks
    private AssetAuditService assetAuditService;

    private User employee;
    private Asset asset;
    private AssetAllocation allocation;
    private AssetAudit audit;

    @BeforeEach
    void sampleData() {

        employee = new User();
        employee.setId(1);
        employee.setUsername("john");

        asset = new Asset();
        asset.setId(1);
        asset.setAssetName("Dell Laptop");

        allocation = new AssetAllocation();
        allocation.setId(1);
        allocation.setEmployee(employee);
        allocation.setAsset(asset);
        allocation.setReturned(false);

        audit = new AssetAudit();
        audit.setId(1);
        audit.setEmployee(employee);
        audit.setAsset(asset);
        audit.setStatus(AuditStatus.PENDING);
    }

    @Test
    void sendAuditToAll_ReturnsAuditList() {

        when(allocationRepository.findByReturnedFalse())
                .thenReturn(List.of(allocation));

        when(auditRepository.saveAll(anyList()))
                .thenReturn(List.of(audit));

        List<AuditRespDto> actualCall =
                assetAuditService.sendAuditToAll();

        assertThat(actualCall).hasSize(1);
        assertThat(actualCall.getFirst().status())
                .isEqualTo(AuditStatus.PENDING);
    }

    @Test
    void getAllAudits_ReturnsSomething() {

        when(auditRepository.findAll())
                .thenReturn(List.of(audit));

        List<AuditRespDto> actualCall =
                assetAuditService.getAllAudits();

        assertThat(actualCall).hasSize(1);
    }

    @Test
    void getMyAudits_ReturnsSomething() {

        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(employee));

        when(auditRepository.findByEmployee(employee))
                .thenReturn(List.of(audit));

        List<AuditRespDto> actualCall =
                assetAuditService.getMyAudits("john");

        assertThat(actualCall).hasSize(1);
    }

    @Test
    void getMyAudits_UserNotFound_ThrowsException() {

        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                assetAuditService.getMyAudits("john"))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void verifyAudit_UpdatesStatus() {

        when(auditRepository.findById(1))
                .thenReturn(Optional.of(audit));

        when(auditRepository.save(any(AssetAudit.class)))
                .thenReturn(audit);

        AuditRespDto actualCall =
                assetAuditService.verifyAudit(1);

        assertThat(actualCall.status())
                .isEqualTo(AuditStatus.VERIFIED);
    }

    @Test
    void rejectAudit_UpdatesStatus() {

        when(auditRepository.findById(1))
                .thenReturn(Optional.of(audit));

        when(auditRepository.save(any(AssetAudit.class)))
                .thenReturn(audit);

        AuditRespDto actualCall =
                assetAuditService.rejectAudit(1);

        assertThat(actualCall.status())
                .isEqualTo(AuditStatus.REJECTED);
    }

    @Test
    void verifyAudit_InvalidId_ThrowsException() {

        when(auditRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                assetAuditService.verifyAudit(100))
                .isInstanceOf(ResponseStatusException.class);
    }
}