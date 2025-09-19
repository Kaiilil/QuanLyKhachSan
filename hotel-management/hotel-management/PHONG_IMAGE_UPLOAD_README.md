# HƯỚNG DẪN UPLOAD ẢNH CHO PHÒNG

## Tổng quan
Đã thêm tính năng upload ảnh cho phòng vào hệ thống quản lý khách sạn. Mỗi phòng có thể có một ảnh mô tả được lưu trữ trong database.

## Các thay đổi đã thực hiện

### 1. Entity Phong
- Thêm trường `anhPhong` (String) để lưu đường dẫn ảnh
- Độ dài tối đa: 255 ký tự

### 2. DTO
- Cập nhật `PhongDTO` để bao gồm trường `anhPhong`
- Cập nhật `DTOConverter` để xử lý trường mới

### 3. Database
- Thêm cột `ANHPHONG` vào bảng `tb_Phong`
- Script SQL: `add_image_column.sql`

### 4. File Storage Service
- Tạo `FileStorageService` để xử lý lưu trữ file
- Hỗ trợ tạo thư mục tự động
- Tạo tên file duy nhất để tránh conflict

### 5. Controllers
- `FileUploadController`: API chung để upload ảnh
- `PhongController`: Thêm API `/api/phong/{id}/upload-image`

### 6. Configuration
- Cấu hình upload file trong `application.properties`
- Cấu hình serve static files trong `WebConfig`

## API Endpoints

### 1. Tạo phòng mới với ảnh
```
POST /api/phong/with-image
Content-Type: multipart/form-data

Parameters:
- tenPhong: String (tên phòng)
- idTang: Integer (ID tầng)
- idLoaiPhong: Integer (ID loại phòng)
- trangThai: String (trạng thái phòng)
- file: MultipartFile (ảnh - optional)

Response:
- 201: Phòng đã được tạo thành công
- 400: Dữ liệu không hợp lệ
- 500: Lỗi server
```

### 2. Upload ảnh cho phòng cụ thể
```
POST /api/phong/{id}/upload-image
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (ảnh)

Response:
- 200: Đường dẫn ảnh đã lưu
- 400: File không hợp lệ
- 404: Không tìm thấy phòng
- 500: Lỗi server
```

### 3. Upload ảnh chung
```
POST /api/upload/room-image
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (ảnh)

Response:
- 200: Đường dẫn ảnh đã lưu
- 400: File không hợp lệ
- 500: Lỗi server
```

## Cách sử dụng

### 1. Chạy script SQL
```sql
-- Chạy file add_image_column.sql để cập nhật database
```

### 2. Tạo phòng mới với ảnh
```bash
# Tạo phòng mới với ảnh
curl -X POST \
  http://localhost:8080/api/phong/with-image \
  -H 'Content-Type: multipart/form-data' \
  -F 'tenPhong=P103' \
  -F 'idTang=1' \
  -F 'idLoaiPhong=2' \
  -F 'trangThai=Trống' \
  -F 'file=@/path/to/room-image.jpg'
```

### 3. Upload ảnh cho phòng đã tồn tại
```bash
# Upload ảnh cho phòng có ID = 1
curl -X POST \
  http://localhost:8080/api/phong/1/upload-image \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/room-image.jpg'
```

### 3. Truy cập ảnh
Sau khi upload, ảnh có thể được truy cập qua URL:
```
http://localhost:8080/uploads/rooms/room_1_1234567890.jpg
```

## Cấu trúc thư mục
```
uploads/
└── rooms/
    ├── room_1_1234567890.jpg
    ├── room_2_1234567891.jpg
    └── ...
```

## Lưu ý
1. Chỉ chấp nhận file ảnh (image/*)
2. Kích thước file tối đa: 10MB
3. Tên file được tạo tự động để tránh conflict
4. Ảnh được lưu trong thư mục `uploads/rooms/`
5. Đường dẫn ảnh được lưu vào database với format `/rooms/filename.jpg`

## Testing

### 1. Sử dụng form HTML
- Mở file `room-upload-form.html` trong trình duyệt
- Điền thông tin phòng và chọn ảnh
- Nhấn "Thêm Phòng" để test

### 2. Sử dụng curl
```bash
# Tạo phòng mới với ảnh
curl -X POST \
  http://localhost:8080/api/phong/with-image \
  -H 'Content-Type: multipart/form-data' \
  -F 'tenPhong=P103' \
  -F 'idTang=1' \
  -F 'idLoaiPhong=2' \
  -F 'trangThai=Trống' \
  -F 'file=@/path/to/room-image.jpg'
```

### 3. Kiểm tra kết quả
1. Khởi động ứng dụng
2. Chạy script SQL để cập nhật database
3. Test API upload ảnh
4. Kiểm tra ảnh được lưu và hiển thị đúng
5. Truy cập `http://localhost:8080/uploads/rooms/` để xem ảnh đã upload
