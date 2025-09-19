# API Công Ty

## Tổng quan
API này cung cấp các chức năng quản lý công ty trong hệ thống quản lý khách sạn.

## Base URL
```
http://localhost:8080/api/congty
```

## Các Endpoint

### 1. Lấy tất cả công ty
```
GET /api/congty
```

### 2. Lấy công ty theo ID
```
GET /api/congty/{id}
```

### 3. Lấy tất cả công ty với thông tin chi tiết
```
GET /api/congty/detail
```

### 4. Lấy công ty theo ID với thông tin chi tiết
```
GET /api/congty/{id}/detail
```

### 5. Tạo công ty mới
```
POST /api/congty
Content-Type: application/json

{
  "maCty": "CTY001",
  "tenCty": "Công ty TNHH ABC",
  "diaChi": "123 Đường ABC, Quận 1, TP.HCM",
  "sdt": "0123456789",
  "email": "info@abc.com"
}
```

### 6. Cập nhật công ty
```
PUT /api/congty/{id}
Content-Type: application/json

{
  "tenCty": "Công ty TNHH ABC (Cập nhật)",
  "diaChi": "456 Đường XYZ, Quận 2, TP.HCM",
  "sdt": "0987654321",
  "email": "contact@abc.com"
}
```

### 7. Xóa công ty
```
DELETE /api/congty/{id}
```

### 8. Tìm kiếm công ty theo tên
```
GET /api/congty/search/ten?tenCty=ABC
```

### 9. Kiểm tra tồn tại theo tên
```
GET /api/congty/exists/ten?tenCty=ABC
```

### 10. Đếm tổng số công ty
```
GET /api/congty/count
```

## Cấu trúc CongTyDTO

```json
{
  "maCty": "CTY001",
  "tenCty": "Công ty TNHH ABC",
  "diaChi": "123 Đường ABC, Quận 1, TP.HCM",
  "sdt": "0123456789",
  "email": "info@abc.com"
}
```

## Ví dụ sử dụng

### Lấy tất cả công ty
```bash
curl -X GET http://localhost:8080/api/congty
```

### Lấy công ty theo ID
```bash
curl -X GET http://localhost:8080/api/congty/CTY001
```

### Tạo công ty mới
```bash
curl -X POST http://localhost:8080/api/congty \
  -H "Content-Type: application/json" \
  -d '{
    "maCty": "CTY002",
    "tenCty": "Công ty TNHH XYZ",
    "diaChi": "789 Đường XYZ, Quận 3, TP.HCM",
    "sdt": "0123456789",
    "email": "info@xyz.com"
  }'
```

### Cập nhật công ty
```bash
curl -X PUT http://localhost:8080/api/congty/CTY001 \
  -H "Content-Type: application/json" \
  -d '{
    "tenCty": "Công ty TNHH ABC (Cập nhật)",
    "diaChi": "456 Đường XYZ, Quận 2, TP.HCM",
    "sdt": "0987654321",
    "email": "contact@abc.com"
  }'
```

### Xóa công ty
```bash
curl -X DELETE http://localhost:8080/api/congty/CTY001
```

### Tìm kiếm theo tên
```bash
curl -X GET "http://localhost:8080/api/congty/search/ten?tenCty=ABC"
```

### Kiểm tra tồn tại
```bash
curl -X GET "http://localhost:8080/api/congty/exists/ten?tenCty=ABC"
```

### Đếm tổng số
```bash
curl -X GET http://localhost:8080/api/congty/count
```

## Lưu ý quan trọng

1. **ID công ty**: Sử dụng `maCty` (mã công ty) làm ID
2. **Validation**: API sẽ trả về lỗi 400 nếu dữ liệu không hợp lệ
3. **CORS**: API hỗ trợ CORS cho tất cả origin
4. **Bảo mật**: Hiện tại API cho phép truy cập công khai (không cần xác thực)

## Mã lỗi

- `200`: Thành công
- `201`: Tạo mới thành công
- `400`: Dữ liệu không hợp lệ
- `404`: Không tìm thấy công ty
- `500`: Lỗi server

## Sử dụng trong ứng dụng

### Frontend
```javascript
// Lấy tất cả công ty
fetch('/api/congty')
  .then(response => response.json())
  .then(data => console.log(data));

// Lấy công ty theo ID
fetch('/api/congty/CTY001')
  .then(response => response.json())
  .then(data => console.log(data));

// Tạo công ty mới
fetch('/api/congty', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    maCty: 'CTY002',
    tenCty: 'Công ty TNHH XYZ',
    diaChi: '789 Đường XYZ, Quận 3, TP.HCM',
    sdt: '0123456789',
    email: 'info@xyz.com'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Backend
```java
// Lấy tất cả công ty
List<CongTyDTO> congTyList = congTyService.getAllCongTyDTO();

// Lấy công ty theo ID
CongTyDTO congTy = congTyService.getCongTyDTOById("CTY001");

// Tạo công ty mới
CongTyDTO newCongTy = new CongTyDTO();
newCongTy.setMaCty("CTY002");
newCongTy.setTenCty("Công ty TNHH XYZ");
// ... set other fields
CongTy savedCongTy = congTyService.saveCongTy(DTOConverter.toCongTy(newCongTy));
```
