package com.lpt.repository;

import com.lpt.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmailId(String emailId);
    boolean existsByEmailId(String emailId);
}
