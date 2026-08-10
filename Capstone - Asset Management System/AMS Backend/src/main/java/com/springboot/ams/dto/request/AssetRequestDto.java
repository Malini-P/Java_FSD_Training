package com.springboot.ams.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssetRequestDto(
        @NotBlank(message = "This field is mandatory")
        @NotNull(message = "This field is mandatory")
        String reason
) {
}
