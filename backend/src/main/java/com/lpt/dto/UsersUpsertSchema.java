package com.lpt.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Used by /authservice/saveuser and /authservice/updateuser.
 * Mirrors your FastAPI example payload.
 */
public record UsersUpsertSchema(
        @NotBlank String fullname,
        String phone,
        @NotBlank String email,
        @NotBlank String password
) {}

