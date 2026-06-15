package com.lpt.repository;

import com.lpt.entity.UserStreakEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStreakRepository extends JpaRepository<UserStreakEntity, Integer> {
    Optional<UserStreakEntity> findByUserId(Integer userId);
}
