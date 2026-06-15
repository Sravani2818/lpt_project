package com.lpt.repository;

import com.lpt.entity.GemTransactionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GemTransactionRepository extends JpaRepository<GemTransactionEntity, Integer> {
    List<GemTransactionEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);
    boolean existsByUserIdAndReason(Integer userId, String reason);
}
