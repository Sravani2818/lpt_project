package com.lpt.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CourseRequest(
        @NotBlank String course_name,
        String description,
        @NotNull @Min(1) Integer duration_hours,
        @NotNull Integer category_id) {}
