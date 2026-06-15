package com.lpt.dto;

public record ProgressDto(
        Integer progress_id,
        Integer user_id,
        Integer course_id,
        String status,
        Double completion_pct,
        Double score,
        String last_updated) {}
