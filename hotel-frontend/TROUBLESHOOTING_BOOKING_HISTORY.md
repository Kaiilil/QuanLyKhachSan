# 🔧 Hướng dẫn khắc phục sự cố: Không xem được lịch sử đặt phòng

## 🚨 Vấn đề
Bạn không thể xem được lịch sử đặt phòng trong trang admin hoặc trang tài khoản.

## 🔍 Các bước chẩn đoán

### 1. Kiểm tra Backend Server
```bash
# Kiểm tra xem backend server có đang chạy không
curl http://localhost:8080/api/datphong

# Hoặc mở browser và truy cập:
# http://localhost:8080/api/datphong
```

**Nếu server không chạy:**
- Khởi động backend server
- Kiểm tra port 8080 có bị chiếm dụng không
- Xem log của backend server để tìm lỗi

### 2. Kiểm tra API Connection
Truy cập trang test API: `/test-booking-api`

Trang này sẽ:
- Test kết nối đến tất cả API endpoints
- Hiển thị dữ liệu raw từ API
- Báo cáo lỗi chi tiết nếu có

### 3. Kiểm tra Environment Variables
Tạo file `.env.local` trong thư mục gốc:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

**Lưu ý:** Thay đổi URL nếu backend chạy trên port khác.

### 4. Kiểm tra Browser Console
1. Mở Developer Tools (F12)
2. Vào tab Console
3. Tìm các lỗi màu đỏ
4. Chụp ảnh lỗi để báo cáo

### 5. Kiểm tra Network Tab
1. Mở Developer Tools (F12)
2. Vào tab Network
3. Refresh trang
4. Tìm các request đến `/api/datphong`
5. Kiểm tra status code và response

## 🛠️ Các giải pháp thường gặp

### Giải pháp 1: Backend Server không chạy
```bash
# Khởi động backend server
cd backend-folder
npm start
# hoặc
java -jar your-backend.jar
```

### Giải pháp 2: Port bị xung đột
```bash
# Kiểm tra port 8080
netstat -ano | findstr :8080

# Thay đổi port trong backend config
# Hoặc thay đổi NEXT_PUBLIC_API_BASE_URL
```

### Giải pháp 3: CORS Issues
Thêm CORS headers vào backend:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Giải pháp 4: Database Connection
Kiểm tra:
- Database server có chạy không
- Connection string đúng không
- Có dữ liệu trong bảng `datphong` không

### Giải pháp 5: API Endpoint không tồn tại
Kiểm tra backend có endpoint:
- `GET /api/datphong`
- `GET /api/phong`
- `GET /api/khachhang`

## 🔧 Debug Tools

### 1. Trang Test API
Truy cập: `/test-booking-api`
- Test tất cả API endpoints
- Hiển thị dữ liệu raw
- Báo cáo lỗi chi tiết

### 2. Debug Component
Trong trang admin bookings, mở section "Debug Information" để xem:
- Environment info
- Data counts
- Sample data
- Raw JSON data

### 3. Console Logs
Mở Developer Tools và xem console để tìm:
- Network errors
- JavaScript errors
- API response errors

## 📋 Checklist khắc phục

- [ ] Backend server đang chạy
- [ ] Port 8080 khả dụng
- [ ] API endpoints trả về dữ liệu
- [ ] Environment variables đúng
- [ ] Không có lỗi CORS
- [ ] Database có dữ liệu
- [ ] Browser console không có lỗi
- [ ] Network requests thành công

## 🆘 Khi nào cần hỗ trợ

Liên hệ hỗ trợ khi:
1. Đã thử tất cả giải pháp trên
2. Backend server chạy nhưng API không trả về dữ liệu
3. Có lỗi database connection
4. Có lỗi CORS không thể khắc phục

**Thông tin cần cung cấp:**
- Screenshot lỗi trong console
- Screenshot trang test API
- Log của backend server
- Environment variables hiện tại
- Browser và version đang sử dụng

## 🔄 Restart Sequence

Nếu vẫn không hoạt động, thử restart theo thứ tự:
1. Restart backend server
2. Clear browser cache (Ctrl+Shift+R)
3. Restart frontend development server
4. Restart database server (nếu cần)

## 📞 Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, vui lòng cung cấp:
- Screenshot trang test API
- Console errors
- Backend server logs
- Mô tả chi tiết vấn đề gặp phải
