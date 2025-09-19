# Hệ thống Quản lý Khách sạn

## Mô tả
Hệ thống quản lý khách sạn được xây dựng bằng Spring Boot với JPA/Hibernate, sử dụng MySQL làm cơ sở dữ liệu.

## Cấu trúc Database

### Các bảng chính:
- **tb_CongTy**: Quản lý thông tin công ty
- **tb_DonVi**: Quản lý các đơn vị trong khách sạn
- **tb_Tang**: Quản lý các tầng
- **tb_LoaiPhong**: Quản lý các loại phòng và giá
- **tb_Phong**: Quản lý thông tin phòng
- **tb_KhachHang**: Quản lý thông tin khách hàng
- **tb_DatPhong**: Quản lý đặt phòng
- **tb_ThanhToan**: Quản lý thanh toán (bao gồm ngày đặt, ngày trả, ngày thanh toán)
- **tb_Users & tb_Roles**: Quản lý người dùng và phân quyền (2 loại: Người dùng - 0, Admin - 1)
- **tb_ThietBi & tb_Phong_ThietBi**: Quản lý thiết bị trong phòng
- **tb_LichSuPhong**: Lịch sử trạng thái phòng
- **tb_SanPham & tb_DatPhong_SanPham**: Quản lý sản phẩm/dịch vụ
- **tb_DuDoanKhach**: Dự đoán số lượng khách

## Cài đặt và Chạy

### Yêu cầu hệ thống:
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Bước 1: Cài đặt Database
1. Tạo database MySQL với tên `quanly_khachsan`
2. Chạy script SQL để tạo các bảng (xem file `database.sql`)

### Bước 2: Cấu hình
1. Cập nhật thông tin kết nối database trong `src/main/resources/application.properties`
2. Điều chỉnh username và password MySQL

### Bước 3: Chạy ứng dụng
```bash
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: http://localhost:8080

## Cấu trúc Entity Classes

### Core Entities:
- `CongTy`: Quản lý thông tin công ty
- `DonVi`: Quản lý đơn vị
- `Tang`: Quản lý tầng
- `LoaiPhong`: Quản lý loại phòng
- `Phong`: Quản lý phòng
- `KhachHang`: Quản lý khách hàng
- `DatPhong`: Quản lý đặt phòng
- `ThanhToan`: Quản lý thanh toán

### User Management:
- `Users`: Quản lý người dùng
- `Roles`: Quản lý vai trò (2 loại: 0-Người dùng, 1-Admin)
- `UserRole`: Enum định nghĩa các vai trò

### Additional Features:
- `ThietBi`: Quản lý thiết bị
- `PhongThietBi`: Liên kết phòng-thiết bị
- `LichSuPhong`: Lịch sử phòng
- `SanPham`: Quản lý sản phẩm/dịch vụ
- `DatPhongSanPham`: Liên kết đặt phòng-sản phẩm
- `DuDoanKhach`: Dự đoán khách

## Mối quan hệ Entity

### One-to-Many:
- CongTy → DonVi
- DonVi → Tang, Phong
- Tang → Phong
- LoaiPhong → Phong
- Phong → DatPhong, LichSuPhong, PhongThietBi
- KhachHang → DatPhong
- DatPhong → ThanhToan, DatPhongSanPham
- Roles → Users
- ThietBi → PhongThietBi
- SanPham → DatPhongSanPham

### Many-to-One:
- Tất cả các entity con đều có quan hệ Many-to-One với entity cha

## Tính năng chính

1. **Quản lý phòng**: Thêm, sửa, xóa phòng và theo dõi trạng thái
2. **Quản lý khách hàng**: Lưu trữ thông tin khách hàng
3. **Đặt phòng**: Quản lý quá trình đặt phòng
4. **Thanh toán**: Xử lý thanh toán và hóa đơn
5. **Quản lý thiết bị**: Theo dõi thiết bị trong từng phòng
6. **Báo cáo**: Thống kê và báo cáo
7. **Phân quyền**: Hệ thống quản lý người dùng và vai trò
8. **Dự đoán**: Dự đoán số lượng khách theo tháng

## Repository Interfaces

### Core Repositories:
- `CongTyRepository`: Quản lý truy vấn công ty
- `DonViRepository`: Quản lý truy vấn đơn vị
- `TangRepository`: Quản lý truy vấn tầng
- `LoaiPhongRepository`: Quản lý truy vấn loại phòng
- `PhongRepository`: Quản lý truy vấn phòng
- `KhachHangRepository`: Quản lý truy vấn khách hàng
- `DatPhongRepository`: Quản lý truy vấn đặt phòng
- `ThanhToanRepository`: Quản lý truy vấn thanh toán

### User Management Repositories:
- `RolesRepository`: Quản lý truy vấn vai trò
- `UsersRepository`: Quản lý truy vấn người dùng

### Additional Repositories:
- `DuDoanKhachRepository`: Quản lý truy vấn dự đoán khách
- `ThietBiRepository`: Quản lý truy vấn thiết bị
- `PhongThietBiRepository`: Quản lý truy vấn phòng-thiết bị
- `LichSuPhongRepository`: Quản lý truy vấn lịch sử phòng
- `SanPhamRepository`: Quản lý truy vấn sản phẩm
- `DatPhongSanPhamRepository`: Quản lý truy vấn đặt phòng-sản phẩm

### Tính năng Repository:
- **Tìm kiếm**: Theo ID, tên, trạng thái, ngày tháng
- **Lọc**: Theo điều kiện phức tạp
- **Sắp xếp**: Theo thứ tự tăng/giảm
- **Thống kê**: Đếm, tính tổng, tìm min/max
- **Truy vấn tùy chỉnh**: Sử dụng @Query annotation
- **Phân trang**: Hỗ trợ Pageable

## API Endpoints

(Để được phát triển tiếp theo)

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 