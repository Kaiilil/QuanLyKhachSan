package com.holtel.hotel_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.Roles;

@Repository
public interface RolesRepository extends JpaRepository<Roles, Integer> {
    
    // Tìm vai trò theo tên
    Optional<Roles> findByRoleName(String roleName);
    
    // Kiểm tra tồn tại theo tên vai trò
    boolean existsByRoleName(String roleName);
    
    // Tìm vai trò theo ID (0: Người dùng, 1: Admin)
    Optional<Roles> findByIdRole(Integer idRole);
} 