package com.springboot.ams.dto.response;

import java.time.Instant;

public record AllocationRespDto(
        int allocationId,
        int employeeId,
        String employeeUsername,
        int assetId,
        String assetName,
        String assetModel,
        Instant allocatedAt,
        boolean returned,
        Instant returnedAt
) {
}
