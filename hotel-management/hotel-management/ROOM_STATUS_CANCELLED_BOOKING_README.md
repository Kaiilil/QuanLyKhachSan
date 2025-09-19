# Logic Cập nhật Trạng thái Phòng - Xử lý Đơn đặt Phòng Bị Hủy

## Mô tả
Đã cập nhật logic cập nhật trạng thái phòng theo thời gian thực để xử lý đúng trường hợp đơn đặt phòng bị hủy.

## Logic mới

### **Quy tắc cập nhật trạng thái phòng:**

#### **1. Chỉ tính các đơn đặt phòng có trạng thái "Đã xác nhận"**
- **"Đang sử dụng"**: Có đơn đặt phòng đang diễn ra với trạng thái "Đã xác nhận" (ngày hiện tại nằm trong khoảng từ ngày đặt đến ngày trả)
- **"Trống"**: Không có đơn đặt phòng nào đang diễn ra hoặc tất cả đơn đặt phòng có trạng thái khác "Đã xác nhận"

#### **2. Đơn đặt phòng "Đã hủy" không ảnh hưởng đến trạng thái phòng**
- Khi đơn đặt phòng chuyển sang "Đã hủy", phòng sẽ được coi là "Trống"
- Đơn đặt phòng "Đã hủy" không được tính vào trạng thái phòng
- Đơn đặt phòng "Chờ xử lý" cũng không được tính vào trạng thái phòng

## Các trạng thái đơn đặt phòng

### **"Chờ xử lý"**
- Trạng thái mặc định khi tạo đơn đặt phòng mới
- **Không ảnh hưởng** đến trạng thái phòng
- Phòng vẫn được coi là "Trống"

### **"Đã xác nhận"**
- Đơn đặt phòng đã được xác nhận bởi admin
- **Ảnh hưởng** đến trạng thái phòng:
  - Nếu đang diễn ra → Phòng "Đang sử dụng"
  - Nếu trong tương lai → Phòng "Đã đặt"

### **"Đã hủy"**
- Đơn đặt phòng đã bị hủy bởi admin
- **Không ảnh hưởng** đến trạng thái phòng
- Phòng được coi là "Trống"

### **"Đã thanh toán"**
- Đơn đặt phòng đã thanh toán hoàn tất
- **Ảnh hưởng** đến trạng thái phòng (tương tự "Đã xác nhận")
- Được xử lý qua hệ thống thanh toán riêng biệt

## Logic cập nhật trạng thái phòng

### **Function `updateRoomStatusBasedOnBookings()`:**
```java
// Chỉ tính các đơn đặt phòng có trạng thái "Đã xác nhận"
boolean hasActiveBooking = phong.getDanhSachDatPhong().stream()
    .anyMatch(booking -> {
        return !booking.getNgayDat().isAfter(today) && 
               !booking.getNgayTra().isBefore(today) &&
               "Đã xác nhận".equals(booking.getTrangThai());
    });

boolean hasFutureBooking = phong.getDanhSachDatPhong().stream()
    .anyMatch(booking -> {
        return booking.getNgayDat().isAfter(today) &&
               "Đã xác nhận".equals(booking.getTrangThai());
    });
```

### **Function `updateRoomStatus(Integer phongId)`:**
- Cập nhật trạng thái cho một phòng cụ thể
- Sử dụng logic tương tự như `updateRoomStatusBasedOnBookings()`

## Tự động cập nhật

### **Trigger Events:**
1. **Khi tạo đơn đặt phòng mới** → Tự động cập nhật trạng thái phòng
2. **Khi cập nhật đơn đặt phòng** → Tự động cập nhật trạng thái phòng
3. **Khi đơn đặt phòng chuyển sang "Đã hủy"** → Phòng tự động chuyển về "Trống"

### **API Endpoints:**
- `POST /api/phong/update-status-all` - Cập nhật tất cả phòng
- `POST /api/phong/{id}/update-status` - Cập nhật một phòng cụ thể

## Ví dụ thực tế

### **Kịch bản 1: Đơn đặt phòng bị hủy**
1. Phòng A có đơn đặt phòng "Đã xác nhận" từ 01/01/2025 đến 05/01/2025
2. Trạng thái phòng: "Đang sử dụng" (nếu đang trong khoảng thời gian) hoặc "Đã đặt" (nếu chưa đến)
3. Admin hủy đơn đặt phòng → Trạng thái đơn đặt phòng: "Đã hủy"
4. **Kết quả**: Phòng A chuyển về "Trống"

### **Kịch bản 2: Nhiều đơn đặt phòng**
1. Phòng B có 2 đơn đặt phòng:
   - Đơn 1: "Đã xác nhận" từ 01/01/2025 đến 05/01/2025
   - Đơn 2: "Đã hủy" từ 10/01/2025 đến 15/01/2025
2. **Kết quả**: Phòng B có trạng thái dựa trên đơn 1 (vì đơn 2 bị hủy)

### **Kịch bản 3: Đơn đặt phòng chờ xử lý**
1. Phòng C có đơn đặt phòng "Chờ xử lý" từ 01/01/2025 đến 05/01/2025
2. **Kết quả**: Phòng C vẫn "Trống" (vì đơn đặt phòng chưa được xác nhận)

## Files đã cập nhật

### **Backend:**
- `PhongService.java`
  - Thêm `updateRoomStatusBasedOnBookings()` với logic mới
  - Thêm `updateRoomStatus(Integer phongId)` với logic mới
  - Chỉ tính các đơn đặt phòng có trạng thái "Đã xác nhận"

- `PhongController.java`
  - Thêm API endpoint `POST /api/phong/update-status-all`
  - Thêm API endpoint `POST /api/phong/{id}/update-status`

- `DatPhongController.java`
  - Thêm import `PhongService`
  - Tự động cập nhật trạng thái phòng khi tạo/cập nhật đơn đặt phòng

## Lợi ích

### **1. Tính chính xác**
- Trạng thái phòng phản ánh chính xác tình trạng thực tế
- Đơn đặt phòng bị hủy không làm sai lệch trạng thái phòng

### **2. Tự động hóa**
- Tự động cập nhật trạng thái phòng khi có thay đổi đơn đặt phòng
- Không cần can thiệp thủ công

### **3. Nhất quán dữ liệu**
- Logic rõ ràng, dễ hiểu và bảo trì
- Tránh xung đột giữa các trạng thái

### **4. Tích hợp tốt**
- Tích hợp chặt chẽ với logic cập nhật trạng thái đơn đặt phòng
- Hỗ trợ frontend cập nhật trạng thái thời gian thực

## Quy trình xử lý

1. **Tạo đơn đặt phòng** → Trạng thái "Chờ xử lý" → Phòng vẫn "Trống"
2. **Admin xác nhận** → Trạng thái "Đã xác nhận" → Phòng "Đã đặt" hoặc "Đang sử dụng"
3. **Admin hủy** → Trạng thái "Đã hủy" → Phòng "Trống"
4. **Thanh toán** → Xử lý qua hệ thống thanh toán riêng biệt
