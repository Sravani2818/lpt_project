package com.lpt.dto;

import jakarta.validation.constraints.NotBlank;

public record SigninSchema(
        @NotBlank String username,
        @NotBlank String password
) {}

