package com.springboot.ams.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordDto(
        @NotBlank
        String username,
        @NotBlank
        String newPassword
) {
}