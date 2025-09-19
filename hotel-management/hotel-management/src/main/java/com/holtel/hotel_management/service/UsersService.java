package com.holtel.hotel_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.UsersDTO;
import com.holtel.hotel_management.entity.Users;
import com.holtel.hotel_management.repository.UsersRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Lấy tất cả người dùng
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    // Lấy người dùng theo ID
    public Optional<Users> getUserById(Integer id) {
        return usersRepository.findById(id);
    }

    // Lưu người dùng mới
    public Users saveUser(Users user) {
        return usersRepository.save(user);
    }

    // Cập nhật người dùng
    public Users updateUser(Integer id, Users userDetails) {
        Optional<Users> existingUser = usersRepository.findById(id);
        if (existingUser.isPresent()) {
            Users user = existingUser.get();
            if (userDetails.getUsername() != null) {
                user.setUsername(userDetails.getUsername());
            }
            // Không cập nhật password tại đây (tránh ghi đè null/clear). Dùng updatePassword()
            if (userDetails.getEmail() != null) {
                user.setEmail(userDetails.getEmail());
            }
            if (userDetails.getSoDienThoai() != null) {
                user.setSoDienThoai(userDetails.getSoDienThoai());
            }
            if (userDetails.getDiaChi() != null) {
                user.setDiaChi(userDetails.getDiaChi());
            }
            // Chỉ cập nhật role nếu được truyền rõ ràng
            if (userDetails.getRole() != null) {
                user.setRole(userDetails.getRole());
            }
            return usersRepository.save(user);
        }
        return null;
    }

    // Kiểm tra xem user có thể xóa được không
    public boolean isUserDeletable(Integer id) {
        // Kiểm tra xem user có đang được sử dụng trong các bảng khác không
        // Có thể thêm logic kiểm tra ràng buộc ở đây nếu cần
        return true; // Mặc định cho phép xóa
    }

    // Xóa người dùng
    public boolean deleteUser(Integer id) {
        try {
            if (usersRepository.existsById(id)) {
                usersRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            // Log lỗi để debug
            System.err.println("Error deleting user with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Không thể xóa user do ràng buộc dữ liệu: " + e.getMessage());
        }
    }

    // Tìm người dùng theo username
    public Optional<Users> findByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    // Tìm người dùng theo email
    public Optional<Users> findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    // Tìm người dùng theo vai trò
    public List<Users> findByRole_IdRole(Integer idRole) {
        return usersRepository.findByRole_IdRole(idRole);
    }

    // Tìm người dùng theo username và password
    public Optional<Users> findByUsernameAndPassword(String username, String password) {
        return usersRepository.findByUsernameAndPassword(username, password);
    }

    // Tìm người dùng theo email và password
    public Optional<Users> findByEmailAndPassword(String email, String password) {
        return usersRepository.findByEmailAndPassword(email, password);
    }

    // Kiểm tra tồn tại theo username
    public boolean existsByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }

    // Kiểm tra tồn tại theo email
    public boolean existsByEmail(String email) {
        return usersRepository.existsByEmail(email);
    }

    // Kiểm tra tồn tại theo username và password
    public boolean existsByUsernameAndPassword(String username, String password) {
        return usersRepository.existsByUsernameAndPassword(username, password);
    }

    // Đếm tổng số người dùng
    public long countAllUsers() {
        return usersRepository.count();
    }

    // Đếm người dùng theo vai trò
    public long countByRole_IdRole(Integer idRole) {
        return usersRepository.countByRole_IdRole(idRole);
    }

    // Lấy danh sách người dùng theo thứ tự username tăng dần
    public List<Users> getAllUsersOrderByUsernameAsc() {
        return usersRepository.findAllByOrderByUsernameAsc();
    }

    // Lấy danh sách người dùng theo thứ tự username giảm dần
    public List<Users> getAllUsersOrderByUsernameDesc() {
        return usersRepository.findAllByOrderByUsernameDesc();
    }

    // Tìm người dùng có chứa từ khóa trong username
    public List<Users> findByUsernameContaining(String keyword) {
        return usersRepository.findByUsernameContaining(keyword);
    }

    // Tìm người dùng có chứa từ khóa trong email
    public List<Users> findByEmailContaining(String keyword) {
        return usersRepository.findByEmailContaining(keyword);
    }

    // Tìm người dùng theo từ khóa (tìm trong username và email)
    public List<Users> findByKeyword(String keyword) {
        return usersRepository.findByKeyword(keyword);
    }

    // Tìm admin users
    public List<Users> findAdminUsers() {
        return usersRepository.findAdminUsers();
    }

    // Tìm regular users
    public List<Users> findRegularUsers() {
        return usersRepository.findRegularUsers();
    }

    // Tìm người dùng theo vai trò tên
    public List<Users> findByRoleName(String roleName) {
        return usersRepository.findByRoleName(roleName);
    }

    // Tìm người dùng theo vai trò tên và sắp xếp theo username
    public List<Users> findByRoleNameOrderByUsernameAsc(String roleName) {
        return usersRepository.findByRoleNameOrderByUsernameAsc(roleName);
    }

    // Tìm người dùng theo vai trò và sắp xếp theo username
    public List<Users> findByRole_IdRoleOrderByUsernameAsc(Integer idRole) {
        return usersRepository.findByRole_IdRoleOrderByUsernameAsc(idRole);
    }

    // Xác thực người dùng
    public Optional<Users> authenticateUser(String username, String password) {
        return usersRepository.findByUsernameAndPassword(username, password);
    }

    // Xác thực người dùng bằng email
    public Optional<Users> authenticateUserByEmail(String email, String password) {
        return usersRepository.findByEmailAndPassword(email, password);
    }

    // Kiểm tra người dùng có phải admin không
    public boolean isAdmin(Integer userId) {
        Optional<Users> user = usersRepository.findById(userId);
        return user.isPresent() && user.get().isAdmin();
    }

    // Kiểm tra người dùng có phải user thường không
    public boolean isRegularUser(Integer userId) {
        Optional<Users> user = usersRepository.findById(userId);
        return user.isPresent() && user.get().isUser();
    }

    // Tìm người dùng theo vai trò enum
    public List<Users> findByUserRole(String userRole) {
        if ("ADMIN".equalsIgnoreCase(userRole)) {
            return usersRepository.findByRole_IdRole(1);
        } else if ("USER".equalsIgnoreCase(userRole)) {
            return usersRepository.findByRole_IdRole(0);
        }
        return usersRepository.findAll();
    }

    // Tạo người dùng mới với vai trò mặc định
    public Users createUserWithDefaultRole(Users user) {
        // Mặc định là user thường (role = 0)
        if (user.getRole() == null) {
            // Cần inject RolesService để lấy role mặc định
            // Tạm thời để null, sẽ xử lý trong controller
        }
        return usersRepository.save(user);
    }

    // Cập nhật mật khẩu
    public boolean updatePassword(Integer userId, String newPassword) {
        Optional<Users> existingUser = usersRepository.findById(userId);
        if (existingUser.isPresent()) {
            Users user = existingUser.get();
            // Mã hoá mật khẩu mới bằng BCrypt
            user.setPassword(passwordEncoder.encode(newPassword));
            usersRepository.save(user);
            return true;
        }
        return false;
    }

    // Đổi mật khẩu với kiểm tra mật khẩu hiện tại
    public boolean changePassword(Integer userId, String currentPassword, String newPassword) {
        Optional<Users> existingUser = usersRepository.findById(userId);
        if (existingUser.isPresent()) {
            Users user = existingUser.get();
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return false;
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            usersRepository.save(user);
            return true;
        }
        return false;
    }

    // Cập nhật email
    public boolean updateEmail(Integer userId, String newEmail) {
        Optional<Users> existingUser = usersRepository.findById(userId);
        if (existingUser.isPresent()) {
            Users user = existingUser.get();
            user.setEmail(newEmail);
            usersRepository.save(user);
            return true;
        }
        return false;
    }

    public List<UsersDTO> getAllUsersDTO() {
        return DTOConverter.toUsersDTOList(usersRepository.findAll());
    }
    public UsersDTO getUserDTOById(Integer id) {
        Optional<Users> user = usersRepository.findById(id);
        return user.map(DTOConverter::toUsersDTO).orElse(null);
    }
} 