package com.holtel.hotel_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.RolesDTO;
import com.holtel.hotel_management.entity.Roles;
import com.holtel.hotel_management.repository.RolesRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    // Lấy tất cả vai trò
    public List<Roles> getAllRoles() {
        return rolesRepository.findAll();
    }

    // Lấy vai trò theo ID
    public Optional<Roles> getRoleById(Integer id) {
        return rolesRepository.findById(id);
    }

    // Lưu vai trò mới
    public Roles saveRole(Roles role) {
        return rolesRepository.save(role);
    }

    // Cập nhật vai trò
    public Roles updateRole(Integer id, Roles roleDetails) {
        Optional<Roles> existingRole = rolesRepository.findById(id);
        if (existingRole.isPresent()) {
            Roles role = existingRole.get();
            role.setRoleName(roleDetails.getRoleName());
            return rolesRepository.save(role);
        }
        return null;
    }

    // Xóa vai trò
    public boolean deleteRole(Integer id) {
        if (rolesRepository.existsById(id)) {
            rolesRepository.deleteById(id);
            return true;
        }
        return false;
    }

  

    // Kiểm tra tồn tại theo tên
    public boolean existsByRoleName(String roleName) {
        return rolesRepository.existsByRoleName(roleName);
    }

    // Đếm tổng số vai trò
    public long countAllRoles() {
        return rolesRepository.count();
    }

    // Tìm vai trò theo ID (0: Người dùng, 1: Admin)
    public Optional<Roles> findByIdRole(Integer idRole) {
        return rolesRepository.findByIdRole(idRole);
    }

    public List<RolesDTO> getAllRolesDTO() {
        return DTOConverter.toRolesDTOList(rolesRepository.findAll());
    }
    public RolesDTO getRoleDTOById(Integer id) {
        Optional<Roles> role = rolesRepository.findById(id);
        return role.map(DTOConverter::toRolesDTO).orElse(null);
    }
    public List<Roles> findByRoleName(String roleName) {
        return rolesRepository.findByRoleName(roleName).map(List::of).orElse(List.of());
    }
} 