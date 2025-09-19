package com.holtel.hotel_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.AuthResponseDTO;
import com.holtel.hotel_management.dto.LoginDTO;
import com.holtel.hotel_management.entity.Users;
import com.holtel.hotel_management.repository.UsersRepository;
import com.holtel.hotel_management.util.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponseDTO login(LoginDTO loginDTO) {
        try {
            // Tìm user theo username
            Users user = usersRepository.findByUsername(loginDTO.getUsername())
                    .orElse(null);

            if (user == null) {
                return new AuthResponseDTO(null, null, null, null, null, 
                    "Tài khoản không tồn tại", null, false);
            }

            // Kiểm tra password
            if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
                return new AuthResponseDTO(null, null, null, null, null, 
                    "Mật khẩu không đúng", null, false);
            }

            // Tạo JWT token
            String token = jwtUtil.generateToken(
                user.getUsername(), 
                user.getIdUser(), 
                user.getRole() != null ? user.getRole().getIdRole() : null
            );

            // Trả về response thành công
            return new AuthResponseDTO(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getIdUser(),
                user.getRole() != null ? user.getRole().getIdRole() : null,
                user.getRole() != null ? user.getRole().getRoleName() : null,
                "Đăng nhập thành công",
                true
            );

        } catch (Exception e) {
            return new AuthResponseDTO(null, null, null, null, null, 
                "Lỗi đăng nhập: " + e.getMessage(), null, false);
        }
    }

    public AuthResponseDTO validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            Integer userId = jwtUtil.extractUserId(token);
            Integer roleId = jwtUtil.extractRoleId(token);

            if (username == null || userId == null) {
                return new AuthResponseDTO(null, null, null, null, null, 
                    "Token không hợp lệ", null, false);
            }

            Users user = usersRepository.findById(userId).orElse(null);
            if (user == null) {
                return new AuthResponseDTO(null, null, null, null, null, 
                    "Người dùng không tồn tại", null, false);
            }

            if (!jwtUtil.validateToken(token, username)) {
                return new AuthResponseDTO(null, null, null, null, null, 
                    "Token đã hết hạn", null, false);
            }

            return new AuthResponseDTO(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getIdUser(),
                user.getRole() != null ? user.getRole().getIdRole() : null,
                user.getRole() != null ? user.getRole().getRoleName() : null,
                "Token hợp lệ",
                true
            );

        } catch (Exception e) {
            return new AuthResponseDTO(null, null, null, null, null, 
                "Lỗi xác thực token: " + e.getMessage(), null,  false);
        }
    }
} 