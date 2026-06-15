package com.lpt.dto;

import jakarta.validation.constraints.NotBlank;

public record SignupSchema(
        @NotBlank String fullname,
        String phone,
        @NotBlank String email,
        @NotBlank String password
) {}

