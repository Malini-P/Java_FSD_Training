package com.springboot.ams.dto.response;

import com.springboot.ams.enums.Role;

import java.time.Instant;

public record UserRespDto(
        int id,
        String username,
        Role role,
        Instant createdAt
) {
}
