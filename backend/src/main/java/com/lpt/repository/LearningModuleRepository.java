package com.lpt.repository;

import com.lpt.entity.LearningModuleEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningModuleRepository extends JpaRepository<LearningModuleEntity, Integer> {
    List<LearningModuleEntity> findByCourseIdOrderByModuleId(Integer courseId);
    long countByCourseId(Integer courseId);
}
