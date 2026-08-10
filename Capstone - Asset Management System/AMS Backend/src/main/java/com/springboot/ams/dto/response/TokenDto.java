package com.springboot.ams.dto.response;

public record TokenDto(
        String username,
        String token,
        String role
) {
}