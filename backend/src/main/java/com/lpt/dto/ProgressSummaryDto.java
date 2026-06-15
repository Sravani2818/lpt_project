package com.lpt.dto;

import java.util.List;

public record ProgressSummaryDto(
        Integer user_id,
        String fullname,
        int total_courses,
        int completed,
        int in_progress,
        int not_started,
        double average_score,
        double overall_completion_pct,
        List<ProgressDto> records) {}
