package com.lpt.service;

import com.lpt.dto.ProgressDto;
import com.lpt.dto.ProgressRequest;
import com.lpt.dto.ProgressSummaryDto;
import com.lpt.entity.ProgressEntity;
import com.lpt.entity.ProgressStatus;
import com.lpt.entity.UserEntity;
import com.lpt.mapper.EntityMapper;
import com.lpt.repository.CourseRepository;
import com.lpt.repository.ProgressRepository;
import com.lpt.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final GemService gemService;

    public ProgressService(
            ProgressRepository progressRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            GemService gemService) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.gemService = gemService;
    }

    public List<ProgressDto> findAll(Integer userIdFilter, Integer requesterId, Short requesterRole) {
        List<ProgressEntity> records;
        if (requesterRole == 3 || requesterRole == 2) {
            records = userIdFilter != null
                    ? progressRepository.findByUserId(userIdFilter)
                    : progressRepository.findAll();
        } else {
            records = progressRepository.findByUserId(requesterId);
        }
        return records.stream().map(EntityMapper::toProgressDto).toList();
    }

    public ProgressDto findById(Integer id) {
        return progressRepository
                .findById(id)
                .map(EntityMapper::toProgressDto)
                .orElseThrow(() -> new IllegalArgumentException("Progress not found"));
    }

    @Transactional
    public ProgressDto createOrUpdate(ProgressRequest request) {
        var existing = progressRepository.findByUserIdAndCourseId(request.user_id(), request.course_id());
        ProgressEntity entity = existing.orElseGet(ProgressEntity::new);
        boolean isNew = entity.getProgressId() == null;
        boolean wasCompleted = !isNew && entity.getCompletionPct() != null && entity.getCompletionPct() >= 100;
        if (entity.getProgressId() == null) {
            entity.setUserId(request.user_id());
            entity.setCourseId(request.course_id());
        }
        entity.setStatus(ProgressStatus.valueOf(request.status()));
        entity.setCompletionPct(resolveCompletionPct(request));
        entity.setScore((int) Math.round(request.score() == null ? 0 : request.score()));
        entity.setLastUpdated(LocalDateTime.now());
        ProgressDto saved = EntityMapper.toProgressDto(progressRepository.save(entity));
        if (isNew) {
            gemService.awardGemsOnce(request.user_id(), 20, "First step taken! 🌱");
        }
        if (!wasCompleted && saved.completion_pct() >= 100) {
            gemService.awardGemsOnce(request.user_id(), 50, "Course completed! 🎓");
            gemService.awardBadge(request.user_id(), "Course Completer", "🎓");
        }
        return saved;
    }

    private int resolveCompletionPct(ProgressRequest request) {
        if (request.completion_pct() != null) {
            return (int) Math.round(request.completion_pct());
        }
        if (request.completed_modules() == null) {
            return 0;
        }
        int totalModules = courseRepository
                .findById(request.course_id())
                .map(course -> Math.max(course.getDurationHours(), 1))
                .orElse(1);
        return Math.min(100, (int) Math.round((request.completed_modules() * 100.0) / totalModules));
    }

    @Transactional
    public void delete(Integer id) {
        if (!progressRepository.existsById(id)) {
            throw new IllegalArgumentException("Progress not found");
        }
        progressRepository.deleteById(id);
    }

    public ProgressSummaryDto buildSummary(Integer userId) {
        UserEntity user = userRepository
                .findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<ProgressDto> records =
                progressRepository.findByUserId(userId).stream().map(EntityMapper::toProgressDto).toList();
        int completed = (int) records.stream().filter(r -> "COMPLETED".equals(r.status())).count();
        int inProgress = (int) records.stream().filter(r -> "IN_PROGRESS".equals(r.status())).count();
        int notStarted = (int) records.stream().filter(r -> "NOT_STARTED".equals(r.status())).count();
        double avgScore = records.stream()
                .filter(r -> r.score() > 0)
                .mapToDouble(ProgressDto::score)
                .average()
                .orElse(0);
        double overallPct = records.isEmpty()
                ? 0
                : records.stream().mapToDouble(ProgressDto::completion_pct).average().orElse(0);
        return new ProgressSummaryDto(
                userId,
                user.getFullname(),
                records.size(),
                completed,
                inProgress,
                notStarted,
                Math.round(avgScore * 10) / 10.0,
                Math.round(overallPct * 10) / 10.0,
                records);
    }
}
