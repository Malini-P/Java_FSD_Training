package com.springboot.ams.dto.response;

public record LoginResponseDto(
        String token,
        String username,
        String role
) {
}