package com.lpt.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ProgressRequest(
        @NotNull Integer user_id,
        @NotNull Integer course_id,
        @NotNull String status,
        Integer completed_modules,
        @Min(0) @Max(100) Double completion_pct,
        @Min(0) @Max(100) Double score) {}
