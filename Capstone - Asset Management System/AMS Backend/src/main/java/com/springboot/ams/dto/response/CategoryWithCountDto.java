package com.springboot.ams.dto.response;

public record CategoryWithCountDto(
        int id,
        String categoryName,
        String description,
        int assetCount
) {}
