# Cấu hình Hệ thống Quản lý Khách sạn

## Tổng quan
Dự án đã được cấu hình với các thành phần sau để đảm bảo hoạt động ổn định và bảo mật:

## 1. WebConfig
**File:** `src/main/java/com/holtel/hotel_management/config/WebConfig.java`

### Chức năng:
- Cấu hình CORS (Cross-Origin Resource Sharing)
- Cho phép tất cả origins (`*`)
- Hỗ trợ các HTTP methods: GET, POST, PUT, DELETE, OPTIONS
- Cho phép tất cả headers
- Max age: 3600 giây

### Lợi ích:
- Cho phép frontend từ domain khác truy cập API
- Đảm bảo tương thích với các ứng dụng web

## 2. SecurityConfig
**File:** `src/main/java/com/holtel/hotel_management/config/SecurityConfig.java`

### Chức năng:
- Cấu hình bảo mật cơ bản
- Vô hiệu hóa CSRF protection (cho API)
- Cho phép truy cập tất cả endpoints `/api/**` mà không cần xác thực
- Yêu cầu xác thực cho các request khác

### Lợi ích:
- Bảo vệ ứng dụng khỏi các cuộc tấn công CSRF
- Cho phép API hoạt động mà không cần authentication phức tạp
- Có thể mở rộng để thêm JWT authentication sau này

## 3. RoleInitializer
**File:** `src/main/java/com/holtel/hotel_management/config/RoleInitializer.java`

### Chức năng:
- Khởi tạo các roles cơ bản khi ứng dụng khởi động
- Tự động tạo các roles: ADMIN, USER, MANAGER, STAFF
- Chỉ tạo roles nếu chưa tồn tại trong database

### Roles được tạo:
- **ADMIN**: Quản trị viên hệ thống
- **USER**: Người dùng thông thường
- **MANAGER**: Quản lý
- **STAFF**: Nhân viên

### Lợi ích:
- Đảm bảo hệ thống luôn có roles cần thiết
- Tự động hóa quá trình setup
- Tránh lỗi khi chưa có roles

## 4. DataInitializer
**File:** `src/main/java/com/holtel/hotel_management/config/DataInitializer.java`

### Chức năng:
- Khởi tạo dữ liệu mẫu cho các entity chính
- Chỉ tạo dữ liệu nếu database trống
- Tạo dữ liệu test để dễ dàng phát triển

### Dữ liệu được tạo:

#### Công ty (CongTy):
- CTY001: Công ty Du lịch ABC
- CTY002: Công ty Lữ hành XYZ

#### Loại phòng (LoaiPhong):
- Phòng Đơn: 500,000 VND
- Phòng Đôi: 800,000 VND
- Phòng Suite: 1,500,000 VND

#### Khách hàng (KhachHang):
- Nguyễn Văn A (Hà Nội)
- Trần Thị B (TP.HCM)

#### Sản phẩm (SanPham):
- Nước khoáng: 15,000 VND
- Bánh snack: 25,000 VND
- Cà phê: 35,000 VND

#### Thiết bị (ThietBi):
- Tủ lạnh mini
- TV 32 inch
- Điều hòa 1 chiều

#### Users:
- admin@hotel.com (ADMIN role)
- user@hotel.com (USER role)

### Lợi ích:
- Có sẵn dữ liệu để test API
- Giảm thời gian setup ban đầu
- Đảm bảo tính nhất quán của dữ liệu

## Cách sử dụng

### 1. Khởi động ứng dụng:
```bash
mvn spring-boot:run
```

### 2. Kiểm tra logs:
Khi ứng dụng khởi động, bạn sẽ thấy các thông báo:
```
Đã tạo role ADMIN
Đã tạo role USER
Đã tạo role MANAGER
Đã tạo role STAFF
Đã tạo dữ liệu công ty mẫu
Đã tạo dữ liệu loại phòng mẫu
Đã tạo dữ liệu khách hàng mẫu
Đã tạo dữ liệu sản phẩm mẫu
Đã tạo dữ liệu thiết bị mẫu
Đã tạo dữ liệu user mẫu
```

### 3. Test API:
```bash
# Test API công ty
curl http://localhost:8080/api/congty

# Test API khách hàng
curl http://localhost:8080/api/khachhang

# Test API loại phòng
curl http://localhost:8080/api/loaiphong
```

## Lưu ý quan trọng

1. **Chỉ chạy một lần**: DataInitializer chỉ tạo dữ liệu khi database trống
2. **Có thể tùy chỉnh**: Bạn có thể sửa đổi dữ liệu mẫu trong DataInitializer
3. **Bảo mật**: SecurityConfig hiện tại cho phép truy cập tự do, có thể thêm authentication sau
4. **CORS**: WebConfig cho phép tất cả origins, có thể giới hạn cho production

## Mở rộng trong tương lai

1. **JWT Authentication**: Thêm JWT token cho bảo mật
2. **Role-based Access Control**: Phân quyền chi tiết hơn
3. **Audit Logging**: Ghi log các hoạt động
4. **Rate Limiting**: Giới hạn số request
5. **API Documentation**: Thêm Swagger/OpenAPI 