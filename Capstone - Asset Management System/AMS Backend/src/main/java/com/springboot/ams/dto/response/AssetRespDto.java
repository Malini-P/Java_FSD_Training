package com.springboot.ams.dto.response;

import com.springboot.ams.enums.AssetStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record AssetRespDto(
        int assetId,
        String assetName,
        String assetModel,
        String serialNumber,
        AssetStatus assetStatus,
        int categoryId,
        String categoryName,
        Instant manufacturingDate,
        Instant expiryDate,
        BigDecimal assetValue,
        String imagePath
) {
}
