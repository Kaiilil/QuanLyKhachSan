# API Xem Chi Tiết Phòng

## Tổng quan
API này cung cấp chức năng xem thông tin chi tiết của phòng bao gồm thông tin cơ bản, thiết bị, lịch sử, đặt phòng và thống kê.

## Base URL
```
http://localhost:8080/api/phong
```

## Các Endpoint

### 1. Lấy tất cả phòng với thông tin chi tiết
```
GET /api/phong/detail
```

### 2. Lấy phòng theo ID với thông tin chi tiết
```
GET /api/phong/{id}/detail
```

## Cấu trúc PhongDetailDTO

```json
{
  "idPhong": 1,
  "tenPhong": "Phòng 101",
  "trangThai": "Trống",
  
  "idTang": 1,
  "tenTang": "Tầng 1",
  
  "idLoaiPhong": 1,
  "tenLoaiPhong": "Phòng Standard",
  "gia": 500000.00,
  "moTa": "Phòng tiêu chuẩn với đầy đủ tiện nghi",
  
  "idDvi": 1,
  "tenDvi": "Khách sạn ABC",
  
  "maCty": "CTY001",
  "tenCty": "Công ty TNHH ABC",
  
  "danhSachThietBi": [
    {
      "id": 1,
      "idPhong": 1,
      "idThietBi": 1,
      "soLuong": 2
    }
  ],
  
  "danhSachLichSu": [
    {
      "idLsp": 1,
      "idPhong": 1,
      "thoiGian": "2025-01-15T10:30:00",
      "trangThai": "Đã dọn dẹp"
    }
  ],
  
  "danhSachDatPhong": [
    {
      "idDatPhong": 1,
      "idPhong": 1,
      "idKh": 1,
      "ngayDat": "2025-01-10",
      "ngayTra": "2025-01-12",
      "trangThai": "Đã xác nhận"
    }
  ],
  
  "soLuongDatPhong": 5,
  "soLuongThietBi": 8,
  "soLuongLichSu": 12
}
```

## Thông tin chi tiết bao gồm:

### 1. Thông tin cơ bản
- `idPhong`: ID phòng
- `tenPhong`: Tên phòng
- `trangThai`: Trạng thái phòng (Trống, Đã đặt, Đang sử dụng, Bảo trì)

### 2. Thông tin tầng
- `idTang`: ID tầng
- `tenTang`: Tên tầng

### 3. Thông tin loại phòng
- `idLoaiPhong`: ID loại phòng
- `tenLoaiPhong`: Tên loại phòng
- `gia`: Giá phòng
- `moTa`: Mô tả loại phòng

### 4. Thông tin đơn vị
- `idDvi`: ID đơn vị
- `tenDvi`: Tên đơn vị

### 5. Thông tin công ty
- `maCty`: Mã công ty
- `tenCty`: Tên công ty

### 6. Danh sách thiết bị
- `danhSachThietBi`: Danh sách thiết bị trong phòng
- `soLuongThietBi`: Số lượng thiết bị

### 7. Danh sách lịch sử
- `danhSachLichSu`: Lịch sử hoạt động của phòng
- `soLuongLichSu`: Số lượng lịch sử

### 8. Danh sách đặt phòng
- `danhSachDatPhong`: Danh sách đặt phòng hiện tại
- `soLuongDatPhong`: Số lượng đặt phòng

## Ví dụ sử dụng

### Lấy chi tiết phòng theo ID
```bash
curl -X GET http://localhost:8080/api/phong/1/detail
```

### Lấy tất cả phòng với thông tin chi tiết
```bash
curl -X GET http://localhost:8080/api/phong/detail
```

## Trạng thái phòng
- `"Trống"`: Phòng chưa có khách
- `"Đã đặt"`: Phòng đã được đặt nhưng chưa check-in
- `"Đang sử dụng"`: Phòng đang có khách
- `"Bảo trì"`: Phòng đang bảo trì

## Lưu ý quan trọng

1. **Thông tin chi tiết**: API trả về đầy đủ thông tin liên quan đến phòng
2. **Quan hệ dữ liệu**: Bao gồm thông tin từ các bảng liên quan
3. **Thống kê**: Cung cấp số lượng các danh sách con
4. **Performance**: API có thể chậm với dữ liệu lớn do load nhiều quan hệ
5. **CORS**: API hỗ trợ CORS cho tất cả origin

## Mã lỗi

- `200`: Thành công
- `404`: Không tìm thấy phòng
- `500`: Lỗi server

## So sánh với API cơ bản

| API | Thông tin | Dữ liệu trả về |
|-----|-----------|----------------|
| `GET /api/phong/{id}` | Cơ bản | Chỉ thông tin phòng |
| `GET /api/phong/{id}/detail` | Chi tiết | Đầy đủ thông tin + quan hệ |

## Sử dụng trong ứng dụng

### Frontend
```javascript
// Lấy thông tin cơ bản
fetch('/api/phong/1')
  .then(response => response.json())
  .then(data => console.log(data));

// Lấy thông tin chi tiết
fetch('/api/phong/1/detail')
  .then(response => response.json())
  .then(data => {
    console.log('Thông tin phòng:', data);
    console.log('Số thiết bị:', data.soLuongThietBi);
    console.log('Danh sách thiết bị:', data.danhSachThietBi);
  });
```

### Backend
```java
// Lấy thông tin cơ bản
PhongDTO phong = phongService.getPhongDTOById(1);

// Lấy thông tin chi tiết
PhongDetailDTO phongDetail = phongService.getPhongDetailById(1);
```
