package com.lpt.repository;

import com.lpt.entity.ModuleSubmissionEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleSubmissionRepository extends JpaRepository<ModuleSubmissionEntity, Integer> {
    List<ModuleSubmissionEntity> findByUserId(Integer userId);
    List<ModuleSubmissionEntity> findByCourseId(Integer courseId);
    List<ModuleSubmissionEntity> findByModuleId(Integer moduleId);
    Optional<ModuleSubmissionEntity> findTopByUserIdAndModuleIdOrderBySubmittedAtDesc(Integer userId, Integer moduleId);
}
