package com.holtel.hotel_management.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.holtel.hotel_management.entity.Roles;
import com.holtel.hotel_management.repository.RolesRepository;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RolesRepository rolesRepository;

    @Override
    public void run(String... args) throws Exception {
        // Khởi tạo roles nếu chưa có
        initializeRoles();
    }

    private void initializeRoles() {
        try {
            // Kiểm tra và tạo role ADMIN nếu chưa tồn tại
            if (!rolesRepository.existsByRoleName("ADMIN")) {
                Roles adminRole = new Roles();
                adminRole.setRoleName("ADMIN");
                rolesRepository.save(adminRole);
                System.out.println("Đã tạo role ADMIN");
            }

            // Kiểm tra và tạo role USER nếu chưa tồn tại
            if (!rolesRepository.existsByRoleName("USER")) {
                Roles userRole = new Roles();
                userRole.setRoleName("USER");
                rolesRepository.save(userRole);
                System.out.println("Đã tạo role USER");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi khởi tạo roles: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 