package com.holtel.hotel_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {
    
    // Tìm người dùng theo username
    Optional<Users> findByUsername(String username);
    
    // Tìm người dùng theo email
    Optional<Users> findByEmail(String email);
    
    // Tìm người dùng theo vai trò
    List<Users> findByRole_IdRole(Integer idRole);
    
    // Tìm người dùng theo username và password
    Optional<Users> findByUsernameAndPassword(String username, String password);
    
    // Tìm người dùng theo email và password
    Optional<Users> findByEmailAndPassword(String email, String password);
    
    // Kiểm tra tồn tại theo username
    boolean existsByUsername(String username);
    
    // Kiểm tra tồn tại theo email
    boolean existsByEmail(String email);
    
    // Kiểm tra tồn tại theo username và password
    boolean existsByUsernameAndPassword(String username, String password);
    
    // Đếm số người dùng theo vai trò
    long countByRole_IdRole(Integer idRole);
    
    // Tìm người dùng có chứa từ khóa trong username
    @Query("SELECT u FROM Users u WHERE u.username LIKE %:keyword%")
    List<Users> findByUsernameContaining(@Param("keyword") String keyword);
    
    // Tìm người dùng có chứa từ khóa trong email
    @Query("SELECT u FROM Users u WHERE u.email LIKE %:keyword%")
    List<Users> findByEmailContaining(@Param("keyword") String keyword);
    
    // Tìm người dùng theo từ khóa (tìm trong username và email)
    @Query("SELECT u FROM Users u WHERE u.username LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<Users> findByKeyword(@Param("keyword") String keyword);
    
    // Sắp xếp theo username tăng dần
    List<Users> findAllByOrderByUsernameAsc();
    
    // Sắp xếp theo username giảm dần
    List<Users> findAllByOrderByUsernameDesc();
    
    // Tìm người dùng theo vai trò và sắp xếp theo username
    List<Users> findByRole_IdRoleOrderByUsernameAsc(Integer idRole);
    
    // Tìm admin users
    @Query("SELECT u FROM Users u WHERE u.role.idRole = 1")
    List<Users> findAdminUsers();
    
    // Tìm regular users
    @Query("SELECT u FROM Users u WHERE u.role.idRole = 0")
    List<Users> findRegularUsers();
    
    // Tìm người dùng theo vai trò tên
    @Query("SELECT u FROM Users u WHERE u.role.roleName = :roleName")
    List<Users> findByRoleName(@Param("roleName") String roleName);
    
    // Tìm người dùng theo vai trò tên và sắp xếp theo username
    @Query("SELECT u FROM Users u WHERE u.role.roleName = :roleName ORDER BY u.username ASC")
    List<Users> findByRoleNameOrderByUsernameAsc(@Param("roleName") String roleName);
    
    // Tìm người dùng theo username và eager load role để tránh LazyInitializationException
    @Query("SELECT u FROM Users u JOIN FETCH u.role WHERE u.username = :username")
    Optional<Users> findByUsernameWithRole(@Param("username") String username);
} 