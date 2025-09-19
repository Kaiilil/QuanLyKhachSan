-- =====================================================
-- SCRIPT SỬA DATABASE HIỆN TẠI (KHÔNG MẤT DỮ LIỆU)
-- =====================================================

USE quanly_khachsan;

-- Bước 1: Tạo bảng tạm để lưu dữ liệu users hiện tại
CREATE TABLE tb_Users_temp AS SELECT * FROM tb_Users;

-- Bước 2: Xóa ràng buộc khóa ngoại từ tb_Users
ALTER TABLE tb_Users DROP FOREIGN KEY tb_users_ibfk_1;

-- Bước 3: Xóa và tạo lại bảng tb_Roles với AUTO_INCREMENT
DROP TABLE IF EXISTS tb_Roles;

CREATE TABLE tb_Roles (
  IDROLE INT PRIMARY KEY AUTO_INCREMENT,
  ROLENAME NVARCHAR(50)
);

-- Bước 4: Thêm lại dữ liệu roles (chỉ còn ADMIN và USER)
INSERT INTO tb_Roles (ROLENAME) VALUES 
('ADMIN'),
('USER');

-- Thêm dữ liệu mẫu cho các bảng khác (nếu cần)
-- Công ty
INSERT INTO tb_CongTy (MACTY, TENCTY) VALUES 
('CT01', N'Công ty TNHH MTV Khách sạn Hòa Bình');

-- Đơn vị (Khách sạn)
INSERT INTO tb_DonVi (TENDVI, MACTY) VALUES 
(N'Khách sạn Luxury Hà Nội', 'CT01'),
(N'Khách sạn Premium Sài Gòn', 'CT01'),
(N'Khách sạn Resort Đà Nẵng', 'CT01');

-- Tầng
INSERT INTO tb_Tang (TENTANG, IDDVI) VALUES 
(N'Tầng 1', 1), (N'Tầng 2', 1), (N'Tầng 3', 1),
(N'Tầng 1', 2), (N'Tầng 2', 2),
(N'Tầng 1', 3), (N'Tầng 2', 3);

-- Loại phòng
INSERT INTO tb_LoaiPhong (TENLOAIPHONG, GIA, MOTA) VALUES 
(N'Phòng đơn', 500000, N'Phòng dành cho 1 người'),
(N'Phòng đôi', 800000, N'Phòng dành cho 2 người'),
(N'Phòng VIP', 1500000, N'Phòng sang trọng, đầy đủ tiện nghi');

-- Phòng
INSERT INTO tb_Phong (TENPHONG, IDTANG, IDLOAIPHONG, IDDVI, TRANGTHAI) VALUES 
-- Khách sạn Luxury Hà Nội
(N'P101', 1, 1, 1, N'Trống'),
(N'P102', 1, 2, 1, N'Trống'),
(N'P201', 2, 3, 1, N'Đang sử dụng'),
-- Khách sạn Premium Sài Gòn
(N'P101', 4, 1, 2, N'Trống'),
(N'P201', 5, 3, 2, N'Trống'),
-- Khách sạn Resort Đà Nẵng
(N'P101', 6, 1, 3, N'Trống'),
(N'P201', 7, 3, 3, N'Đang sử dụng');

-- Bước 5: Cập nhật IDROLE trong bảng tạm
-- Với AUTO_INCREMENT: 1-Người dùng, 2-Admin
UPDATE tb_Users_temp SET IDROLE = 1 WHERE IDROLE = 0; -- Người dùng
UPDATE tb_Users_temp SET IDROLE = 2 WHERE IDROLE = 1; -- Admin

-- Bước 6: Xóa bảng users cũ và tạo lại
DROP TABLE tb_Users;

CREATE TABLE tb_Users (
  IDUSER INT PRIMARY KEY AUTO_INCREMENT,
  USERNAME NVARCHAR(50),
  PASSWORD NVARCHAR(255),
  EMAIL NVARCHAR(100),
  IDROLE INT,
  FOREIGN KEY (IDROLE) REFERENCES tb_Roles(IDROLE)
);

-- Bước 7: Khôi phục dữ liệu users
INSERT INTO tb_Users (IDUSER, USERNAME, PASSWORD, EMAIL, IDROLE)
SELECT IDUSER, USERNAME, PASSWORD, EMAIL, IDROLE FROM tb_Users_temp;

-- Bước 8: Xóa bảng tạm
DROP TABLE tb_Users_temp;

-- Bước 9: Kiểm tra kết quả
SELECT 'Kiểm tra bảng Roles:' AS Info;
SELECT * FROM tb_Roles;

SELECT 'Kiểm tra bảng Users:' AS Info;
SELECT u.*, r.ROLENAME 
FROM tb_Users u 
JOIN tb_Roles r ON u.IDROLE = r.IDROLE;

-- Thông báo hoàn thành
SELECT 'Đã sửa xong database!' AS Status; 