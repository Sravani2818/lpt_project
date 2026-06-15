package com.lpt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "roles_mapping")
@IdClass(RolesMappingEntity.RolesMappingId.class)
public class RolesMappingEntity {

    @Id
    @Column(name = "mid")
    private Integer mid;

    @Id
    @Column(name = "role")
    private Short role;

    public Integer getMid() {
        return mid;
    }

    public void setMid(Integer mid) {
        this.mid = mid;
    }

    public Short getRole() {
        return role;
    }

    public void setRole(Short role) {
        this.role = role;
    }

    public static class RolesMappingId implements Serializable {
        private Integer mid;
        private Short role;

        public RolesMappingId() {}

        public RolesMappingId(Integer mid, Short role) {
            this.mid = mid;
            this.role = role;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RolesMappingId that = (RolesMappingId) o;
            return Objects.equals(mid, that.mid) && Objects.equals(role, that.role);
        }

        @Override
        public int hashCode() {
            return Objects.hash(mid, role);
        }
    }
}
