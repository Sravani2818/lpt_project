package com.lpt.repository;

import com.lpt.entity.MenuEntity;
import com.lpt.entity.RolesMappingEntity;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<MenuEntity, Integer> {

    @Query(
            "select m from MenuEntity m join RolesMappingEntity rm on m.mid = rm.mid where rm.role = :role")
    List<MenuEntity> findMenusByRole(@Param("role") Short role);
}

