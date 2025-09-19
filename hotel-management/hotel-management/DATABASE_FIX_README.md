# Hướng Dẫn Sửa Database Hoàn Chỉnh

## Các File Database Đã Sửa

### 1. `database_complete_fixed.sql` - Database Mới Hoàn Chỉnh
- **Mục đích**: Tạo database mới từ đầu với thứ tự đúng
- **Đặc điểm**: 
  - Thứ tự tạo bảng hợp lý (tránh lỗi khóa ngoại)
  - Bảng `tb_Roles` có `AUTO_INCREMENT`
  - Dữ liệu users được cập nhật đúng ID roles
  - Dữ liệu mẫu thực tế: 3 khách sạn (Luxury Hà Nội, Premium Sài Gòn, Resort Đà Nẵng)

### 2. `fix_existing_database.sql` - Sửa Database Hiện Tại
- **Mục đích**: Sửa database đã có dữ liệu mà không mất dữ liệu
- **Đặc điểm**:
  - Sao lưu dữ liệu users vào bảng tạm
  - Sửa bảng `tb_Roles` với `AUTO_INCREMENT`
  - Khôi phục dữ liệu users với ID roles đúng
  - Thêm dữ liệu mẫu cho các bảng khác nếu cần

### 3. `fix_roles_table.sql` - Script Đơn Giản
- **Mục đích**: Chỉ sửa bảng `tb_Roles` (cho trường hợp database trống)
- **Lưu ý**: Chỉ dùng khi không có dữ liệu quan trọng

## Cách Sử Dụng

### Trường Hợp 1: Tạo Database Mới
```sql
-- Chạy file database_complete_fixed.sql
source database_complete_fixed.sql;
```

### Trường Hợp 2: Sửa Database Hiện Tại (Có Dữ Liệu)
```sql
-- Chạy file fix_existing_database.sql
source fix_existing_database.sql;
```

### Trường Hợp 3: Database Trống
```sql
-- Chạy file fix_roles_table.sql
source fix_roles_table.sql;
```

## Thay Đổi Chính

### 1. Bảng `tb_Roles`
```sql
-- Trước
CREATE TABLE tb_Roles (
  IDROLE INT PRIMARY KEY,
  ROLENAME NVARCHAR(50)
);

-- Sau
CREATE TABLE tb_Roles (
  IDROLE INT PRIMARY KEY AUTO_INCREMENT,
  ROLENAME NVARCHAR(50)
);
```

### 2. Dữ Liệu Users
```sql
-- Trước (ID roles: 0-Người dùng, 1-Admin)
INSERT INTO tb_Users (USERNAME, PASSWORD, EMAIL, IDROLE) VALUES 
('admin', 'admin123', 'admin@hotel.com', 1),
('user1', 'user123', 'user1@hotel.com', 0);

-- Sau (ID roles: 1-Người dùng, 2-Admin)
INSERT INTO tb_Users (USERNAME, PASSWORD, EMAIL, IDROLE) VALUES 
('admin', 'admin123', 'admin@hotel.com', 2),
('user1', 'user123', 'user1@hotel.com', 1);
```

## Kiểm Tra Sau Khi Sửa

```sql
-- Kiểm tra bảng Roles
SELECT * FROM tb_Roles;

-- Kiểm tra Users và Roles
SELECT u.*, r.ROLENAME 
FROM tb_Users u 
JOIN tb_Roles r ON u.IDROLE = r.IDROLE;
```

## Lưu Ý Quan Trọng

1. **Backup dữ liệu** trước khi chạy script sửa
2. **Kiểm tra kết quả** sau khi chạy script
3. **Test ứng dụng** để đảm bảo hoạt động bình thường
4. **Cập nhật code** nếu có hardcode ID roles (0, 1) thành (1, 2)

## Lỗi Thường Gặp

### Lỗi: "Cannot drop table referenced by foreign key"
- **Nguyên nhân**: Bảng được tham chiếu bởi khóa ngoại
- **Giải pháp**: Dùng `fix_existing_database.sql` thay vì `fix_roles_table.sql`

### Lỗi: "Field 'IDROLE' doesn't have a default value"
- **Nguyên nhân**: JPA entity dùng `@GeneratedValue` nhưng database không có `AUTO_INCREMENT`
- **Giải pháp**: Đã được sửa trong các file database mới 