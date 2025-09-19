-- =====================================================
-- HỆ THỐNG QUẢN LÝ KHÁCH SẠN - DATABASE COMPLETE (FIXED)
-- =====================================================

-- Tạo CSDL
CREATE DATABASE IF NOT EXISTS quanly_khachsan;
USE quanly_khachsan;

-- =====================================================
-- BẢNG CÔNG TY (Tạo trước vì được tham chiếu bởi tb_DonVi)
-- =====================================================
CREATE TABLE tb_CongTy (
  MACTY NVARCHAR(50) PRIMARY KEY,
  TENCTY NVARCHAR(100)
);

INSERT INTO tb_CongTy (MACTY, TENCTY) VALUES 
('CT01', N'Công ty TNHH MTV Khách sạn Hòa Bình');

-- =====================================================
-- BẢNG ĐƠN VỊ (Tạo sau tb_CongTy vì có FK tham chiếu)
-- =====================================================
CREATE TABLE tb_DonVi (
  IDDVI INT PRIMARY KEY AUTO_INCREMENT,
  TENDVI NVARCHAR(100),
  MACTY NVARCHAR(50),
  FOREIGN KEY (MACTY) REFERENCES tb_CongTy(MACTY)
);

INSERT INTO tb_DonVi (TENDVI, MACTY) VALUES 
(N'Khách sạn Luxury Hà Nội', 'CT01'),
(N'Khách sạn Premium Sài Gòn', 'CT01'),
(N'Khách sạn Resort Đà Nẵng', 'CT01');

-- =====================================================
-- BẢNG TẦNG (Tạo sau tb_DonVi vì có FK tham chiếu)
-- =====================================================
CREATE TABLE tb_Tang (
  IDTANG INT PRIMARY KEY AUTO_INCREMENT,
  TENTANG NVARCHAR(50),
  IDDVI INT,
  FOREIGN KEY (IDDVI) REFERENCES tb_DonVi(IDDVI)
);

INSERT INTO tb_Tang (TENTANG, IDDVI) VALUES 
(N'Tầng 1', 1),
(N'Tầng 2', 1),
(N'Tầng 3', 1),
(N'Tầng 1', 2),
(N'Tầng 2', 2),
(N'Tầng 1', 3),
(N'Tầng 2', 3);

-- =====================================================
-- BẢNG LOẠI PHÒNG (Không có FK, tạo độc lập)
-- =====================================================
CREATE TABLE tb_LoaiPhong (
  IDLOAIPHONG INT PRIMARY KEY AUTO_INCREMENT,
  TENLOAIPHONG NVARCHAR(100),
  GIA DECIMAL(10,2),
  MOTA NVARCHAR(255),
  HINHANH NVARCHAR(255)
);

INSERT INTO tb_LoaiPhong (TENLOAIPHONG, GIA, MOTA, HINHANH) VALUES 
(N'Phòng đơn', 500000, N'Phòng dành cho 1 người', '/uploads/rooms/standard.jpg'),
(N'Phòng đôi', 800000, N'Phòng dành cho 2 người', '/uploads/rooms/double.jpg'),
(N'Phòng VIP', 1500000, N'Phòng sang trọng, đầy đủ tiện nghi', '/uploads/rooms/vip.jpg');

-- =====================================================
-- BẢNG PHÒNG (Tạo sau tb_Tang, tb_LoaiPhong, tb_DonVi)
-- =====================================================
CREATE TABLE tb_Phong (
  IDPHONG INT PRIMARY KEY AUTO_INCREMENT,
  TENPHONG NVARCHAR(50),
  IDTANG INT,
  IDLOAIPHONG INT,
  IDDVI INT,
  TRANGTHAI NVARCHAR(50), -- VD: Trống, Đang sử dụng, Bảo trì
  FOREIGN KEY (IDTANG) REFERENCES tb_Tang(IDTANG),
  FOREIGN KEY (IDLOAIPHONG) REFERENCES tb_LoaiPhong(IDLOAIPHONG),
  FOREIGN KEY (IDDVI) REFERENCES tb_DonVi(IDDVI)
);

INSERT INTO tb_Phong (TENPHONG, IDTANG, IDLOAIPHONG, IDDVI, TRANGTHAI) VALUES 
-- Khách sạn Luxury Hà Nội (IDDVI = 1)
(N'P101', 1, 1, 1, N'Trống'),
(N'P102', 1, 2, 1, N'Trống'),
(N'P201', 2, 3, 1, N'Đang sử dụng'),
(N'P202', 2, 1, 1, N'Trống'),
(N'P301', 3, 3, 1, N'Trống'),
-- Khách sạn Premium Sài Gòn (IDDVI = 2)
(N'P101', 4, 1, 2, N'Trống'),
(N'P102', 4, 2, 2, N'Đang sử dụng'),
(N'P201', 5, 3, 2, N'Trống'),
-- Khách sạn Resort Đà Nẵng (IDDVI = 3)
(N'P101', 6, 1, 3, N'Trống'),
(N'P201', 7, 3, 3, N'Đang sử dụng');

-- =====================================================
-- BẢNG KHÁCH HÀNG (Không có FK, tạo độc lập)
-- =====================================================
CREATE TABLE tb_KhachHang (
  IDKH INT PRIMARY KEY AUTO_INCREMENT,
  HOTEN NVARCHAR(100),
  CCCD VARCHAR(20),
  SDT VARCHAR(15),
  EMAIL VARCHAR(100),
  DIACHI NVARCHAR(255)
);

INSERT INTO tb_KhachHang (HOTEN, CCCD, SDT, EMAIL, DIACHI) VALUES 
(N'Nguyễn Văn A', '123456789', '0987654321', 'nguyenvana@email.com', N'123 Đường A'),
(N'Trần Thị B', '987654321', '0912345678', 'tranthib@email.com', N'456 Đường B');

-- =====================================================
-- BẢNG ĐẶT PHÒNG (Tạo sau tb_Phong, tb_KhachHang)
-- =====================================================
CREATE TABLE tb_DatPhong (
  IDDATPHONG INT PRIMARY KEY AUTO_INCREMENT,
  IDPHONG INT,
  IDKH INT,
  NGAYDAT DATE,
  NGAYTRA DATE,
  TRANGTHAI NVARCHAR(50), -- VD: Chờ xử lý, Đã xác nhận, Đã huỷ
  FOREIGN KEY (IDPHONG) REFERENCES tb_Phong(IDPHONG),
  FOREIGN KEY (IDKH) REFERENCES tb_KhachHang(IDKH)
);

INSERT INTO tb_DatPhong (IDPHONG, IDKH, NGAYDAT, NGAYTRA, TRANGTHAI) VALUES 
(1, 1, '2025-08-01', '2025-08-03', N'Chờ xử lý'),
(2, 2, '2025-08-02', '2025-08-04', N'Đã xác nhận');

-- =====================================================
-- BẢNG THANH TOÁN (Tạo sau tb_DatPhong)
-- =====================================================
CREATE TABLE tb_ThanhToan (
  IDTT INT PRIMARY KEY AUTO_INCREMENT,
  IDDATPHONG INT,
  NGAYTT DATE,
  NGAYDAT DATE,
  NGAYTRA DATE,
  SOTIEN DECIMAL(10,2),
  HINHTHUCTT NVARCHAR(50),
  TRANGTHAI NVARCHAR(50),
  FOREIGN KEY (IDDATPHONG) REFERENCES tb_DatPhong(IDDATPHONG)
);

-- =====================================================
-- BẢNG VAI TRÒ NGƯỜI DÙNG (Tạo trước tb_Users)
-- =====================================================
CREATE TABLE tb_Roles (
  IDROLE INT PRIMARY KEY AUTO_INCREMENT,
  ROLENAME NVARCHAR(50)
);

INSERT INTO tb_Roles (ROLENAME) VALUES 
(N'USER'),
(N'ADMIN');

-- =====================================================
-- BẢNG NGƯỜI DÙNG (Tạo sau tb_Roles)
-- =====================================================
CREATE TABLE tb_Users (
  IDUSER INT PRIMARY KEY AUTO_INCREMENT,
  USERNAME NVARCHAR(50),
  PASSWORD NVARCHAR(255),
  EMAIL NVARCHAR(100),
  SODIENTHOAI NVARCHAR(20),
  DIACHI NVARCHAR(255),
  IDROLE INT,
  FOREIGN KEY (IDROLE) REFERENCES tb_Roles(IDROLE)
);

-- Lưu ý: Mật khẩu phải là BCrypt hash. Không seed mật khẩu plain-text tại đây.
-- Người dùng demo sẽ được khởi tạo bằng BCrypt thông qua DataInitializer của ứng dụng Spring Boot
-- (admin/admin123, user/user123). Nếu cần seed thủ công, hãy cập nhật PASSWORD bằng BCrypt hash.

-- =====================================================
-- BẢNG DỰ ĐOÁN KHÁCH (Tạo sau tb_CongTy, tb_DonVi)
-- =====================================================
CREATE TABLE tb_DuDoanKhach (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  THANG INT,
  NAM INT,
  MACTY NVARCHAR(50),
  IDDVI INT,
  DUDOAN_SOLUONGKHACH INT,
  FOREIGN KEY (MACTY) REFERENCES tb_CongTy(MACTY),
  FOREIGN KEY (IDDVI) REFERENCES tb_DonVi(IDDVI)
);

-- =====================================================
-- BẢNG THIẾT BỊ (Không có FK, tạo độc lập)
-- =====================================================
CREATE TABLE tb_ThietBi (
  IDTB INT PRIMARY KEY AUTO_INCREMENT,
  TENTB NVARCHAR(100),
  MOTA NVARCHAR(255)
);

-- =====================================================
-- BẢNG GẮN THIẾT BỊ VÀO PHÒNG (Tạo sau tb_Phong, tb_ThietBi)
-- =====================================================
CREATE TABLE tb_Phong_ThietBi (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  IDPHONG INT,
  IDTB INT,
  SOLUONG INT,
  FOREIGN KEY (IDPHONG) REFERENCES tb_Phong(IDPHONG),
  FOREIGN KEY (IDTB) REFERENCES tb_ThietBi(IDTB)
);

-- =====================================================
-- BẢNG LỊCH SỬ TRẠNG THÁI PHÒNG (Tạo sau tb_Phong)
-- =====================================================
CREATE TABLE tb_LichSuPhong (
  IDLSP INT PRIMARY KEY AUTO_INCREMENT,
  IDPHONG INT,
  THOIGIAN DATETIME,
  TRANGTHAI NVARCHAR(50),
  FOREIGN KEY (IDPHONG) REFERENCES tb_Phong(IDPHONG)
);

-- =====================================================
-- BẢNG SẢN PHẨM/DỊCH VỤ (Không có FK, tạo độc lập)
-- =====================================================
CREATE TABLE tb_SanPham (
  IDSP INT PRIMARY KEY AUTO_INCREMENT,
  TENSP NVARCHAR(100),
  DONGIA DECIMAL(10,2),
  MOTA NVARCHAR(255)
);

-- =====================================================
-- BẢNG ĐƠN HÀNG SẢN PHẨM THEO ĐẶT PHÒNG (Tạo sau tb_DatPhong, tb_SanPham)
-- =====================================================
CREATE TABLE tb_DatPhong_SanPham (
  IDDP_SP INT PRIMARY KEY AUTO_INCREMENT,
  IDDATPHONG INT,
  IDSP INT,
  SOLUONG INT,
  FOREIGN KEY (IDDATPHONG) REFERENCES tb_DatPhong(IDDATPHONG),
  FOREIGN KEY (IDSP) REFERENCES tb_SanPham(IDSP)
);

-- =====================================================
-- THÔNG TIN HỆ THỐNG
-- =====================================================
-- Tổng số bảng: 15
-- Tổng số quan hệ: 16
-- Cấu trúc vai trò: 1-Người dùng, 2-Admin (AUTO_INCREMENT)
-- Database: quanly_khachsan
-- =====================================================
-- Các ALTER cũ không còn cần thiết do cấu trúc đã đồng bộ với entity Users