package com.lpt.repository;

import com.lpt.entity.BadgeEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeRepository extends JpaRepository<BadgeEntity, Integer> {
    List<BadgeEntity> findByUserIdOrderByEarnedAtDesc(Integer userId);
    boolean existsByUserIdAndBadgeName(Integer userId, String badgeName);
}
