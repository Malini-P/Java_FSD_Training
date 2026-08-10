package com.springboot.ams.dto.response;

import com.springboot.ams.enums.ServiceStatus;

import java.time.Instant;

public record ServiceRequestRespDto(
        int serviceRequestId,
        String issueDescription,
        String issueType,
        ServiceStatus serviceStatus,
        int employeeId,
        String employeeUsername,
        int assetId,
        String assetName,
        Instant createdAt,
        Instant updatedAt
) {
}
