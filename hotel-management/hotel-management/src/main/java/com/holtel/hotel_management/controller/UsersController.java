package com.holtel.hotel_management.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.holtel.hotel_management.dto.UsersDTO;
import com.holtel.hotel_management.entity.Users;
import com.holtel.hotel_management.service.UsersService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UsersController {

    @Autowired
    private UsersService usersService;

    // Lấy tất cả người dùng (chuẩn hóa sang DTO)
    @GetMapping
    public ResponseEntity<List<UsersDTO>> getAllUsers() {
        List<UsersDTO> usersList = usersService.getAllUsersDTO();
        return ResponseEntity.ok(usersList);
    }

    // Lấy người dùng theo ID (chuẩn hóa sang DTO)
    @GetMapping("/{id}")
    public ResponseEntity<UsersDTO> getUserById(@PathVariable Integer id) {
        UsersDTO user = usersService.getUserDTOById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo người dùng mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<UsersDTO> createUser(@RequestBody UsersDTO userDTO) {
        try {
            Users savedUser = usersService.saveUser(DTOConverter.toUsers(userDTO));
            UsersDTO savedDTO = DTOConverter.toUsersDTO(savedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật người dùng (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<UsersDTO> updateUser(@PathVariable Integer id, @RequestBody UsersDTO userDTO) {
        Users updatedUser = usersService.updateUser(id, DTOConverter.toUsers(userDTO));
        if (updatedUser != null) {
            UsersDTO updatedDTO = DTOConverter.toUsersDTO(updatedUser);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Kiểm tra xem user có thể xóa được không
    @GetMapping("/{id}/check-deletable")
    public ResponseEntity<Map<String, Object>> checkUserDeletable(@PathVariable Integer id) {
        try {
            boolean deletable = usersService.isUserDeletable(id);
            Map<String, Object> response = new HashMap<>();
            response.put("deletable", deletable);
            
            if (!deletable) {
                response.put("reason", "User này đang được sử dụng trong hệ thống");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("deletable", false);
            response.put("reason", "Lỗi khi kiểm tra: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        try {
            boolean deleted = usersService.deleteUser(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            // Trả về lỗi 400 với thông tin lỗi chi tiết
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Trả về lỗi 500 cho các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi server: " + e.getMessage());
        }
    }

    // Các API tìm kiếm, lọc, trả về List<Users> => chuyển sang List<UsersDTO>
    @GetMapping("/search/keyword")
    public ResponseEntity<List<UsersDTO>> findByKeyword(@RequestParam String keyword) {
        List<UsersDTO> usersList = DTOConverter.toUsersDTOList(usersService.findByKeyword(keyword));
        return ResponseEntity.ok(usersList);
    }

    // Đếm tổng số người dùng
    @GetMapping("/count")
    public ResponseEntity<Long> countAllUsers() {
        long count = usersService.countAllUsers();
        return ResponseEntity.ok(count);
    }

    // Đổi mật khẩu
    @PostMapping("/{id}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");
        Map<String, Object> resp = new HashMap<>();
        if (currentPassword == null || newPassword == null || newPassword.length() < 6) {
            resp.put("success", false);
            resp.put("message", "Mật khẩu mới phải có ít nhất 6 ký tự");
            return ResponseEntity.badRequest().body(resp);
        }
        boolean ok = usersService.changePassword(id, currentPassword, newPassword);
        if (!ok) {
            resp.put("success", false);
            resp.put("message", "Mật khẩu hiện tại không đúng hoặc người dùng không tồn tại");
            return ResponseEntity.badRequest().body(resp);
        }
        resp.put("success", true);
        resp.put("message", "Đổi mật khẩu thành công");
        return ResponseEntity.ok(resp);
    }
} 