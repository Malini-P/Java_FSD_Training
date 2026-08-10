package com.springboot.ams.dto.request;

import com.springboot.ams.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserDto(
        @NotBlank(message = "This field is mandatory")
        @NotNull(message = "This field is mandatory")
        String username,
        @NotBlank(message = "This field is mandatory")
        @NotNull(message = "This field is mandatory")
        String password,
        @NotNull(message = "This field is mandatory")
        Role role
) {
}
