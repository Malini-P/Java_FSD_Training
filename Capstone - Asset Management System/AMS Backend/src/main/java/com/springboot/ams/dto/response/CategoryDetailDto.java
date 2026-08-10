package com.springboot.ams.dto.response;

public record CategoryDetailDto(
        int id,
        String categoryName,
        String description,
        int totalAssets,
        String apiVersion
) {}
