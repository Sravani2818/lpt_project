package com.lpt.dto;

public record CourseDto(
        Integer course_id,
        String course_name,
        String description,
        Integer duration_hours,
        Integer category_id,
        Integer created_by,
        Short status) {}
