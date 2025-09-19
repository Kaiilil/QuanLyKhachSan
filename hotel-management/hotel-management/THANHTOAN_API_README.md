# API Thanh Toán - Chỉ Hỗ Trợ Hình Thức Payment

## Tổng quan
API thanh toán này được thiết kế để chỉ cho phép thanh toán bằng hình thức "payment". Tất cả các giao dịch thanh toán đều phải sử dụng hình thức này.

## Base URL
```
http://localhost:8080/api/thanhtoan
```

## Các Endpoint

### 1. Lấy tất cả thanh toán
```
GET /api/thanhtoan
```

### 2. Lấy thanh toán theo ID
```
GET /api/thanhtoan/{id}
```

### 3. Tạo thanh toán mới (chỉ payment)
```
POST /api/thanhtoan
Content-Type: application/json

{
  "idDatPhong": 1,
  "ngayTt": "2025-01-15",
  "ngayDat": "2025-01-10",
  "ngayTra": "2025-01-12",
  "soTien": 500000.00,
  "hinhThucTt": "payment",
  "trangThai": "Đang xử lý"
}
```

**Lưu ý**: 
- `hinhThucTt` phải là "payment" (không phân biệt hoa thường)
- Nếu không cung cấp `ngayTt`, sẽ tự động lấy ngày hiện tại
- Nếu không cung cấp `trangThai`, mặc định là "Đang xử lý"

### 4. Cập nhật thanh toán (chỉ payment)
```
PUT /api/thanhtoan/{id}
Content-Type: application/json

{
  "soTien": 600000.00,
  "trangThai": "Hoàn thành",
  "hinhThucTt": "payment"
}
```

**Lưu ý**: 
- `hinhThucTt` phải là "payment" nếu được cung cấp
- Chỉ cập nhật các trường được cung cấp, các trường khác giữ nguyên

### 5. Xóa thanh toán
```
DELETE /api/thanhtoan/{id}
```

### 6. Tìm kiếm và lọc

#### Tìm thanh toán theo đặt phòng
```
GET /api/thanhtoan/datphong/{idDatPhong}
```

#### Tìm thanh toán theo ngày
```
GET /api/thanhtoan/ngay/{ngayTt}
```
Ví dụ: `/api/thanhtoan/ngay/2025-01-15`

#### Tìm thanh toán theo hình thức payment
```
GET /api/thanhtoan/hinhthuc/payment
```

#### Tìm thanh toán theo trạng thái
```
GET /api/thanhtoan/trangthai/{trangThai}
```
Ví dụ: `/api/thanhtoan/trangthai/Hoàn thành`

#### Tìm thanh toán theo khoảng số tiền
```
GET /api/thanhtoan/sotien?minTien=100000&maxTien=1000000
```

#### Tìm thanh toán theo khoảng thời gian
```
GET /api/thanhtoan/thoigian?startDate=2025-01-01&endDate=2025-01-31
```

### 7. Tìm kiếm theo trạng thái cụ thể

#### Thanh toán đã hoàn thành
```
GET /api/thanhtoan/hoanthanh
```

#### Thanh toán đang xử lý
```
GET /api/thanhtoan/dangxuly
```

#### Thanh toán bị hủy
```
GET /api/thanhtoan/dahuy
```

### 8. Tìm kiếm theo thời gian

#### Thanh toán hôm nay
```
GET /api/thanhtoan/homnay
```

#### Thanh toán trong tháng này
```
GET /api/thanhtoan/thangnay
```

### 9. Thống kê

#### Tổng số tiền thanh toán
```
GET /api/thanhtoan/tongtien
```

#### Tổng số tiền theo trạng thái
```
GET /api/thanhtoan/tongtien/trangthai/{trangThai}
```

#### Tổng số tiền theo hình thức payment
```
GET /api/thanhtoan/tongtien/payment
```

#### Số lượng thanh toán
```
GET /api/thanhtoan/count
```

#### Số lượng thanh toán theo hình thức payment
```
GET /api/thanhtoan/count/payment
```

#### Số lượng thanh toán theo trạng thái
```
GET /api/thanhtoan/count/trangthai/{trangThai}
```

### 10. Tìm kiếm theo từ khóa
```
GET /api/thanhtoan/search?keyword=payment
```

### 11. Sắp xếp

#### Theo ngày thanh toán tăng dần
```
GET /api/thanhtoan/sort/ngay-asc
```

#### Theo ngày thanh toán giảm dần
```
GET /api/thanhtoan/sort/ngay-desc
```

#### Theo số tiền tăng dần
```
GET /api/thanhtoan/sort/tien-asc
```

#### Theo số tiền giảm dần
```
GET /api/thanhtoan/sort/tien-desc
```

## Cấu trúc DTO

### ThanhToanDTO
```json
{
  "idTt": 1,
  "idDatPhong": 1,
  "ngayTt": "2025-01-15",
  "ngayDat": "2025-01-10",
  "ngayTra": "2025-01-12",
  "soTien": 500000.00,
  "hinhThucTt": "payment",
  "trangThai": "Hoàn thành"
}
```

## Trạng thái thanh toán
- `"Đang xử lý"`: Thanh toán đang được xử lý
- `"Hoàn thành"`: Thanh toán đã hoàn thành
- `"Đã hủy"`: Thanh toán đã bị hủy

## Hình thức thanh toán
- Chỉ hỗ trợ: `"payment"`

## Ví dụ sử dụng

### Tạo thanh toán mới
```bash
curl -X POST http://localhost:8080/api/thanhtoan \
  -H "Content-Type: application/json" \
  -d '{
    "idDatPhong": 1,
    "soTien": 500000.00,
    "hinhThucTt": "payment",
    "trangThai": "Đang xử lý"
  }'
```

### Cập nhật thanh toán
```bash
curl -X PUT http://localhost:8080/api/thanhtoan/1 \
  -H "Content-Type: application/json" \
  -d '{
    "soTien": 600000.00,
    "trangThai": "Hoàn thành"
  }'
```

### Lấy tất cả thanh toán payment
```bash
curl -X GET http://localhost:8080/api/thanhtoan/hinhthuc/payment
```

## Cấu trúc DTO chuẩn hóa

### ThanhToanDTO
```json
{
  "idTt": 1,
  "idDatPhong": 1,
  "ngayTt": "2025-01-15",
  "ngayDat": "2025-01-10",
  "ngayTra": "2025-01-12",
  "soTien": 500000.00,
  "hinhThucTt": "payment",
  "trangThai": "Hoàn thành"
}
```

### Quy tắc chuẩn hóa DTO

#### Cho việc tạo mới (POST):
- `hinhThucTt`: Tự động set thành "payment"
- `ngayTt`: Tự động set thành ngày hiện tại nếu không cung cấp
- `trangThai`: Tự động set thành "Đang xử lý" nếu không cung cấp
- `soTien`: Bắt buộc phải cung cấp và > 0

#### Cho việc cập nhật (PUT):
- `hinhThucTt`: Tự động set thành "payment"
- Các trường khác: Giữ nguyên giá trị hiện tại nếu không cung cấp
- `soTien`: Nếu cung cấp phải > 0

## Lưu ý quan trọng

1. **Hình thức thanh toán**: Tất cả thanh toán phải sử dụng hình thức "payment"
2. **Validation**: API sẽ trả về lỗi 400 nếu cố gắng sử dụng hình thức thanh toán khác
3. **Chuẩn hóa DTO**: Sử dụng ThanhToanDTOHelper để chuẩn hóa dữ liệu
4. **Tự động**: Ngày thanh toán sẽ tự động lấy ngày hiện tại nếu không được cung cấp
5. **Trạng thái mặc định**: Nếu không cung cấp trạng thái, mặc định là "Đang xử lý"
6. **CORS**: API hỗ trợ CORS cho tất cả origin

## Mã lỗi

- `200`: Thành công
- `201`: Tạo mới thành công
- `400`: Dữ liệu không hợp lệ (hình thức thanh toán không phải payment)
- `404`: Không tìm thấy thanh toán
- `500`: Lỗi server
