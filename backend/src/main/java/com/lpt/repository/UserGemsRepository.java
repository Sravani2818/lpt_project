package com.lpt.repository;

import com.lpt.entity.UserGemsEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserGemsRepository extends JpaRepository<UserGemsEntity, Integer> {
    Optional<UserGemsEntity> findByUserId(Integer userId);
}
