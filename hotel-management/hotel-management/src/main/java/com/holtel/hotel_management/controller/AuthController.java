package com.holtel.hotel_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.holtel.hotel_management.dto.AuthResponseDTO;
import com.holtel.hotel_management.dto.LoginDTO;
import com.holtel.hotel_management.dto.RegisterDTO;
import com.holtel.hotel_management.entity.Roles;
import com.holtel.hotel_management.entity.Users;
import com.holtel.hotel_management.repository.RolesRepository;
import com.holtel.hotel_management.repository.UsersRepository;
import com.holtel.hotel_management.service.AuthService;
import com.holtel.hotel_management.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        AuthResponseDTO response = authService.login(loginDTO);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponseDTO> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(
                new AuthResponseDTO(null, null, null, null, null, null, "Token không hợp lệ", false)
            );
        }

        String token = authHeader.substring(7); // Bỏ "Bearer "
        AuthResponseDTO response = authService.validateToken(token);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterDTO registerDTO, org.springframework.validation.BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMsg = bindingResult.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(
                new AuthResponseDTO(null, null, null, null, null, null, errorMsg, false)
            );
        }
        try {
            // Kiểm tra username đã tồn tại chưa
            if (usersRepository.existsByUsername(registerDTO.getUsername())) {
                return ResponseEntity.badRequest().body(
                    new AuthResponseDTO(null, null, null, null, null, null, "Username đã tồn tại", false)
                );
            }

            // Kiểm tra email đã tồn tại chưa
            if (usersRepository.existsByEmail(registerDTO.getEmail())) {
                return ResponseEntity.badRequest().body(
                    new AuthResponseDTO(null, null, null, null, null, null, "Email đã tồn tại", false)
                );
            }

            // Tạo user mới
            Users newUser = new Users();
            newUser.setUsername(registerDTO.getUsername());
            newUser.setEmail(registerDTO.getEmail());
            newUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
            newUser.setSoDienThoai(registerDTO.getSoDienThoai());
            newUser.setDiaChi(registerDTO.getDiaChi());
            // Set role mặc định là USER
            Roles userRole = rolesRepository.findByRoleName("USER").orElse(null);
            newUser.setRole(userRole);
            Users savedUser = usersRepository.save(newUser);
            // Tạo token cho user mới
            String token = jwtUtil.generateToken(
                savedUser.getUsername(), 
                savedUser.getIdUser(), 
                savedUser.getRole() != null ? savedUser.getRole().getIdRole() : null
            );
            return ResponseEntity.ok(new AuthResponseDTO(
                token,
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getIdUser(),
                savedUser.getRole() != null ? savedUser.getRole().getIdRole() : null,
                savedUser.getRole() != null ? savedUser.getRole().getRoleName() : null,
                "Đăng ký thành công",
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new AuthResponseDTO(null, null, null, null, null, null, "Lỗi đăng ký: " + e.getMessage(), false)
            );
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<AuthResponseDTO> logout() {
        // Trong thực tế, có thể blacklist token hoặc xử lý logout
        return ResponseEntity.ok(new AuthResponseDTO(null, null, null, null, null, null, "Đăng xuất thành công", true));
    }
} 