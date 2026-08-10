package com.springboot.ams.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoryDto(
        @NotBlank(message = "This field is mandatory")
        @NotNull(message = "This field is mandatory")
        String categoryName,
        String description
) {
}
