package com.springboot.ams.dto.response;

import com.springboot.ams.enums.RequestStatus;

import java.time.Instant;

public record AssetRequestRespDto(
        int requestId,
        String reason,
        RequestStatus requestStatus,
        int employeeId,
        String employeeUsername,
        int assetId,
        String assetName,
        Instant createdAt
) {
}
