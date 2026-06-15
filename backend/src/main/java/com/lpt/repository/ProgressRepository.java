package com.lpt.repository;

import com.lpt.entity.ProgressEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgressRepository extends JpaRepository<ProgressEntity, Integer> {
    List<ProgressEntity> findByUserId(Integer userId);
    Optional<ProgressEntity> findByUserIdAndCourseId(Integer userId, Integer courseId);
}
