package com.lpt.mapper;

import com.lpt.dto.CourseDto;
import com.lpt.dto.ProgressDto;
import com.lpt.dto.UserDto;
import com.lpt.entity.CourseEntity;
import com.lpt.entity.ProgressEntity;
import com.lpt.entity.UserEntity;

public final class EntityMapper {

    private EntityMapper() {}

    public static UserDto toUserDto(UserEntity u) {
        return new UserDto(u.getId(), u.getEmailId(), u.getFullname(), u.getPhone(), u.getRole(), u.getStatus());
    }

    public static CourseDto toCourseDto(CourseEntity c) {
        return new CourseDto(
                c.getCourseId(),
                c.getCourseName(),
                c.getDescription(),
                c.getDurationHours(),
                c.getCategoryId(),
                c.getCreatedBy(),
                c.getStatus());
    }

    public static ProgressDto toProgressDto(ProgressEntity p) {
        return new ProgressDto(
                p.getProgressId(),
                p.getUserId(),
                p.getCourseId(),
                p.getStatus().name(),
                p.getCompletionPct().doubleValue(),
                p.getScore().doubleValue(),
                p.getLastUpdated().toString());
    }
}
