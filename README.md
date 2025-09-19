# Hệ Thống Quản Lý Khách Sạn

Hệ thống quản lý khách sạn hoàn chỉnh với frontend Next.js và backend Spring Boot.

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống
- **Node.js** 18+ 
- **Java** 17+
- **MySQL** 8.0+
- **MySQL Workbench** (để chạy file SQL)
- **Maven** 3.6+

### 1. Cài Đặt Database

#### Bước 1: Tạo Database trong MySQL Workbench
1. Mở MySQL Workbench
2. Kết nối đến MySQL server
3. Tạo database mới:
```sql
CREATE DATABASE quanly_khachsan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Bước 2: Import Database Schema
1. Trong MySQL Workbench, chọn database `quanly_khachsan`
2. Mở file `quanlykhachsan.sql`
3. Chạy toàn bộ script SQL để tạo bảng và dữ liệu mẫu
#### Hoặc có thể import cả file .sql vào.

### 2. Cài Đặt Backend

#### Bước 1: Giải nén file backend
```bash
# Giải nén file hotel-management.zip
unzip hotel-management.zip
cd hotel-management
```

#### Bước 2: Cấu hình Database
Chỉnh sửa file `src/main/resources/application.properties`:
```properties
# Thay đổi username và password theo cấu hình MySQL của máy
spring.datasource.username=root
spring.datasource.password=123456
```

#### Bước 3: Chạy Backend
```bash
# Cài đặt dependencies
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### 3. Cài Đặt Frontend

#### Bước 1: Giải nén file frontend
```bash
# Giải nén file hotel-frontend.zip
unzip hotel-frontend.zip
cd hotel-frontend
```

#### Bước 2: Cài đặt dependencies
```bash
npm install --legacy-peer-deps

# hoặc
yarn install
```

#### Bước 3: Chạy Frontend
```bash
npm run dev
# hoặc
yarn dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🚀 Sử Dụng

### Tài Khoản Mặc Định

**Admin:**
- Username: `admin`
- Password: `admin`
- Email: `admin@hotel.com`

**User:**
- Username: `user`
- Password: `user`
- Email: `user@hotel.com`

### Chức Năng Chính

#### 📊 Dashboard
- Xem tổng quan số liệu khách hàng, phòng, đặt phòng
- Doanh thu tổng (chỉ tính các giao dịch đã hoàn thành)
- Biểu đồ doanh thu theo ngày

#### 👤 Quản Lý Khách Hàng
- Xem danh sách khách hàng
- Thêm/sửa/xóa thông tin khách hàng
- Tìm kiếm theo tên, email, CCCD

#### 🏨 Quản Lý Phòng
- Quản lý loại phòng và giá cả
- Quản lý phòng theo tầng
- Upload hình ảnh phòng
- Theo dõi trạng thái phòng

#### 📅 Đặt Phòng
- Tạo đơn đặt phòng mới
- Chọn phòng và ngày check-in/check-out
- Thêm sản phẩm dịch vụ
- Theo dõi trạng thái đặt phòng

#### 💰 Thanh Toán
- Xử lý thanh toán đặt phòng
- Theo dõi trạng thái thanh toán
- Báo cáo doanh thu theo thời gian
- Lọc theo trạng thái thanh toán

## 🔧 Troubleshooting

### Lỗi Thường Gặp

#### Backend không khởi động
```bash
# Kiểm tra Java version
java -version

# Kiểm tra Maven
mvn -version

# Clean và rebuild
mvn clean install
```

#### Database connection failed
- Kiểm tra MySQL service đang chạy
- Kiểm tra username/password trong application.properties
- Đảm bảo database `quanly_khachsan` đã được tạo

#### Frontend build failed
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Kiểm tra Node.js version
node -v
```

#### CORS errors
- Đảm bảo backend đang chạy tại http://localhost:8080
- Kiểm tra frontend đang chạy tại http://localhost:3000

## 📁 Cấu Trúc Project

```
hotel-management/              # Backend Spring Boot
├── src/main/java/
│   └── com/holtel/hotel_management/
│       ├── controller/        # REST controllers
│       ├── service/          # Business logic
│       ├── repository/       # Data access
│       ├── entity/           # JPA entities
│       └── dto/              # Data transfer objects
└── src/main/resources/
    └── application.properties

hotel-frontend/               # Frontend Next.js
├── app/                     # App router pages
├── components/              # React components
├── lib/                     # API utilities
└── public/                  # Static assets

quanlykhachsan.sql          # Database schema
```


---

**Lưu ý:** Đảm bảo thay đổi database credentials trong application.properties theo cấu hình MySQL.
