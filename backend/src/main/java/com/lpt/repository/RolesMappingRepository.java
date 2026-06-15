package com.lpt.repository;

import com.lpt.entity.RolesMappingEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolesMappingRepository extends JpaRepository<RolesMappingEntity, RolesMappingEntity.RolesMappingId> {
    List<RolesMappingEntity> findByRole(Short role);
}
