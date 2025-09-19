package com.holtel.hotel_management.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.holtel.hotel_management.dto.RolesDTO;
import com.holtel.hotel_management.entity.Roles;
import com.holtel.hotel_management.service.RolesService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RolesController {

    @Autowired
    private RolesService rolesService;

    // Lấy tất cả vai trò (chuẩn hóa sang DTO)
    @GetMapping
    public ResponseEntity<List<RolesDTO>> getAllRoles() {
        List<RolesDTO> rolesList = rolesService.getAllRolesDTO();
        return ResponseEntity.ok(rolesList);
    }

    // Lấy vai trò theo ID (chuẩn hóa sang DTO)
    @GetMapping("/{id}")
    public ResponseEntity<RolesDTO> getRoleById(@PathVariable Integer id) {
        RolesDTO role = rolesService.getRoleDTOById(id);
        if (role != null) {
            return ResponseEntity.ok(role);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo vai trò mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<RolesDTO> createRole(@RequestBody RolesDTO roleDTO) {
        try {
            Roles savedRole = rolesService.saveRole(DTOConverter.toRoles(roleDTO));
            RolesDTO savedDTO = DTOConverter.toRolesDTO(savedRole);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật vai trò (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<RolesDTO> updateRole(@PathVariable Integer id, @RequestBody RolesDTO roleDTO) {
        Roles updatedRole = rolesService.updateRole(id, DTOConverter.toRoles(roleDTO));
        if (updatedRole != null) {
            RolesDTO updatedDTO = DTOConverter.toRolesDTO(updatedRole);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa vai trò
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        boolean deleted = rolesService.deleteRole(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Các API tìm kiếm, lọc, trả về List<Roles> => chuyển sang List<RolesDTO>
    @GetMapping("/search/ten")
    public ResponseEntity<List<RolesDTO>> findByRoleName(@RequestParam String roleName) {
        List<RolesDTO> dtoList = DTOConverter.toRolesDTOList(rolesService.findByRoleName(roleName).stream().toList());
        return ResponseEntity.ok(dtoList);
    }

    // Tìm vai trò theo ID (0: Người dùng, 1: Admin)
    @GetMapping("/search/idrole/{idRole}")
    public ResponseEntity<RolesDTO> findByIdRole(@PathVariable Integer idRole) {
        Optional<Roles> role = rolesService.findByIdRole(idRole);
        return role.map(DTOConverter::toRolesDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Kiểm tra tồn tại theo tên
    @GetMapping("/exists/ten")
    public ResponseEntity<Boolean> existsByRoleName(@RequestParam String roleName) {
        boolean exists = rolesService.existsByRoleName(roleName);
        return ResponseEntity.ok(exists);
    }

    // Đếm tổng số vai trò
    @GetMapping("/count")
    public ResponseEntity<Long> countAllRoles() {
        long count = rolesService.countAllRoles();
        return ResponseEntity.ok(count);
    }
} 