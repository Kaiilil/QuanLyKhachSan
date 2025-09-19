# Hướng dẫn sử dụng API DatPhong (Đặt Phòng)

## Tổng quan

API DatPhong cung cấp các chức năng để quản lý việc đặt phòng khách sạn, bao gồm tạo, đọc, cập nhật, xóa và tìm kiếm đặt phòng.

## Cài đặt

### 1. Import API functions

```typescript
import {
  getAllDatPhong,
  createDatPhong,
  updateDatPhong,
  deleteDatPhong,
  getDatPhongById,
  findDatPhongByKhachHang,
  findDatPhongByPhong,
  findDatPhongByTrangThai,
  type DatPhongDTO,
  type DatPhongCreateRequest
} from "@/lib/datphong-api"
```

### 2. Import Custom Hook

```typescript
import { useDatPhong } from "@/hooks/use-datphong"
```

## Kiểu dữ liệu

### DatPhongDTO

```typescript
type DatPhongDTO = {
  idDatPhong?: number      // ID đặt phòng (tự động tạo)
  idPhong: number          // ID phòng
  idKh: number             // ID khách hàng
  ngayDat: string          // Ngày đặt phòng (ISO date string)
  ngayTra: string          // Ngày trả phòng (ISO date string)
  trangThai?: string       // Trạng thái đặt phòng
}
```

### DatPhongCreateRequest

```typescript
type DatPhongCreateRequest = Omit<DatPhongDTO, 'idDatPhong'>
```

## Sử dụng trực tiếp API functions

### 1. Lấy tất cả đặt phòng

```typescript
try {
  const allBookings = await getAllDatPhong()
  console.log('Tất cả đặt phòng:', allBookings)
} catch (error) {
  console.error('Lỗi:', error.message)
}
```

### 2. Tạo đặt phòng mới

```typescript
const newBooking: DatPhongCreateRequest = {
  idPhong: 1,
  idKh: 5,
  ngayDat: "2024-01-15",
  ngayTra: "2024-01-17",
  trangThai: "Chờ xử lý"
}

try {
  const createdBooking = await createDatPhong(newBooking)
  console.log('Đã tạo đặt phòng:', createdBooking)
} catch (error) {
  console.error('Lỗi:', error.message)
}
```

### 3. Cập nhật đặt phòng

```typescript
try {
  const updatedBooking = await updateDatPhong(1, { trangThai: "Đã xác nhận" })
  console.log('Đã cập nhật:', updatedBooking)
} catch (error) {
  console.error('Lỗi:', error.message)
}
```

### 4. Xóa đặt phòng

```typescript
try {
  await deleteDatPhong(1)
  console.log('Đã xóa đặt phòng')
} catch (error) {
  console.error('Lỗi:', error.message)
}
```

### 5. Tìm kiếm đặt phòng

```typescript
// Tìm theo khách hàng
const customerBookings = await findDatPhongByKhachHang(5)

// Tìm theo phòng
const roomBookings = await findDatPhongByPhong(1)

// Tìm theo trạng thái
const pendingBookings = await findDatPhongByTrangThai("Chờ xử lý")

// Lấy đặt phòng hiện tại
const currentBookings = await getDatPhongHienTai()

// Lấy đặt phòng tương lai
const upcomingBookings = await getDatPhongTuongLai()

// Lấy đặt phòng quá khứ
const completedBookings = await getDatPhongQuaKhu()
```

## Sử dụng Custom Hook

### 1. Basic Usage

```typescript
function MyComponent() {
  const {
    datPhongList,
    loading,
    error,
    fetchAllDatPhong,
    addDatPhong,
    updateDatPhongById,
    removeDatPhong
  } = useDatPhong()

  useEffect(() => {
    fetchAllDatPhong()
  }, [fetchAllDatPhong])

  if (loading) return <div>Đang tải...</div>
  if (error) return <div>Lỗi: {error}</div>

  return (
    <div>
      {datPhongList.map(booking => (
        <div key={booking.idDatPhong}>
          Phòng: {booking.idPhong} - Khách: {booking.idKh}
        </div>
      ))}
    </div>
  )
}
```

### 2. Tạo đặt phòng mới

```typescript
function CreateBookingForm() {
  const { addDatPhong, loading } = useDatPhong()

  const handleSubmit = async (formData: DatPhongCreateRequest) => {
    try {
      const newBooking = await addDatPhong(formData)
      console.log('Đã tạo:', newBooking)
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Tạo đặt phòng'}
      </button>
    </form>
  )
}
```

### 3. Cập nhật trạng thái

```typescript
function BookingStatusUpdater({ bookingId }: { bookingId: number }) {
  const { updateDatPhongById } = useDatPhong()

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateDatPhongById(bookingId, { trangThai: newStatus })
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  return (
    <select onChange={(e) => handleStatusChange(e.target.value)}>
      <option value="Chờ xử lý">Chờ xử lý</option>
      <option value="Đã xác nhận">Đã xác nhận</option>
      <option value="Đã thanh toán">Đã thanh toán</option>
      <option value="Đã hủy">Đã hủy</option>
    </select>
  )
}
```

## Sử dụng Component

### 1. Hiển thị danh sách đặt phòng

```typescript
import BookingList from "@/components/booking-list"

function MyPage() {
  return (
    <div>
      <h1>Trang chủ</h1>
      
      {/* Hiển thị 5 đặt phòng gần nhất */}
      <BookingList 
        title="Đặt phòng gần đây" 
        maxItems={5} 
      />
      
      {/* Hiển thị đặt phòng theo trạng thái */}
      <BookingList 
        title="Đặt phòng chờ xử lý" 
        filterByStatus="Chờ xử lý" 
      />
      
      {/* Hiển thị đặt phòng của khách hàng cụ thể */}
      <BookingList 
        title="Đặt phòng của khách hàng" 
        filterByCustomer={5} 
      />
    </div>
  )
}
```

### 2. Hiển thị với actions

```typescript
function AdminPage() {
  return (
    <div>
      <h1>Quản lý đặt phòng</h1>
      
      {/* Hiển thị với nút thay đổi trạng thái */}
      <BookingList 
        title="Quản lý đặt phòng" 
        showActions={true} 
      />
    </div>
  )
}
```

## Xử lý lỗi

### 1. Try-catch với API functions

```typescript
try {
  const result = await createDatPhong(bookingData)
  // Xử lý thành công
} catch (error: any) {
  if (error.message.includes('Tạo đặt phòng thất bại')) {
    // Xử lý lỗi cụ thể
    showErrorMessage('Không thể tạo đặt phòng')
  } else {
    // Xử lý lỗi chung
    showErrorMessage('Đã xảy ra lỗi')
  }
}
```

### 2. Xử lý lỗi với Custom Hook

```typescript
function MyComponent() {
  const { error, clearError } = useDatPhong()

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={clearError}>Thử lại</button>
      </div>
    )
  }

  return <div>Nội dung chính</div>
}
```

## Best Practices

### 1. Validation

```typescript
const validateBooking = (booking: DatPhongCreateRequest): string[] => {
  const errors: string[] = []
  
  if (!booking.idPhong) errors.push('Phải chọn phòng')
  if (!booking.idKh) errors.push('Phải chọn khách hàng')
  if (!booking.ngayDat) errors.push('Phải chọn ngày đặt')
  if (!booking.ngayTra) errors.push('Phải chọn ngày trả')
  
  if (booking.ngayDat && booking.ngayTra) {
    const ngayDat = new Date(booking.ngayDat)
    const ngayTra = new Date(booking.ngayTra)
    
    if (ngayTra <= ngayDat) {
      errors.push('Ngày trả phải sau ngày đặt')
    }
    
    if (ngayDat < new Date()) {
      errors.push('Ngày đặt không thể trong quá khứ')
    }
  }
  
  return errors
}
```

### 2. Loading States

```typescript
function BookingForm() {
  const { addDatPhong, loading } = useDatPhong()
  const [formData, setFormData] = useState<DatPhongCreateRequest>({...})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading) return // Prevent double submission
    
    try {
      await addDatPhong(formData)
      // Reset form
      setFormData({...})
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Tạo đặt phòng'}
      </button>
    </form>
  )
}
```

### 3. Error Boundaries

```typescript
class BookingErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Booking Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Đã xảy ra lỗi</h2>
          <button onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Troubleshooting

### 1. Lỗi kết nối

```typescript
// Kiểm tra API_BASE_URL
console.log('API Base:', process.env.NEXT_PUBLIC_API_BASE_URL)

// Kiểm tra backend có chạy không
try {
  const response = await fetch(`${API_BASE}/api/datphong`)
  console.log('Response status:', response.status)
} catch (error) {
  console.error('Network error:', error)
}
```

### 2. Lỗi validation

```typescript
// Kiểm tra dữ liệu trước khi gửi
const bookingData = {
  idPhong: parseInt(formData.idPhong),
  idKh: parseInt(formData.idKh),
  ngayDat: formData.ngayDat,
  ngayTra: formData.ngayTra
}

console.log('Booking data:', bookingData)
```

### 3. Lỗi CORS

```typescript
// Kiểm tra backend có cho phép CORS không
// Backend cần có @CrossOrigin(origins = "*")
```

## Ví dụ hoàn chỉnh

```typescript
import { useState, useEffect } from "react"
import { useDatPhong } from "@/hooks/use-datphong"
import { DatPhongCreateRequest } from "@/lib/datphong-api"

function CompleteBookingExample() {
  const { datPhongList, loading, error, addDatPhong, fetchAllDatPhong } = useDatPhong()
  const [formData, setFormData] = useState<DatPhongCreateRequest>({
    idPhong: 0,
    idKh: 0,
    ngayDat: "",
    ngayTra: "",
    trangThai: "Chờ xử lý"
  })

  useEffect(() => {
    fetchAllDatPhong()
  }, [fetchAllDatPhong])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await addDatPhong(formData)
      setFormData({
        idPhong: 0,
        idKh: 0,
        ngayDat: "",
        ngayTra: "",
        trangThai: "Chờ xử lý"
      })
    } catch (error) {
      console.error('Lỗi tạo đặt phòng:', error)
    }
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div>Lỗi: {error}</div>

  return (
    <div>
      <h1>Quản lý đặt phòng</h1>
      
      {/* Form tạo đặt phòng */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="ID Phòng"
          value={formData.idPhong || ""}
          onChange={(e) => setFormData({...formData, idPhong: parseInt(e.target.value)})}
        />
        <input
          type="number"
          placeholder="ID Khách hàng"
          value={formData.idKh || ""}
          onChange={(e) => setFormData({...formData, idKh: parseInt(e.target.value)})}
        />
        <input
          type="date"
          value={formData.ngayDat}
          onChange={(e) => setFormData({...formData, ngayDat: e.target.value})}
        />
        <input
          type="date"
          value={formData.ngayTra}
          onChange={(e) => setFormData({...formData, ngayTra: e.target.value})}
        />
        <button type="submit">Tạo đặt phòng</button>
      </form>

      {/* Danh sách đặt phòng */}
      <div>
        <h2>Danh sách đặt phòng ({datPhongList.length})</h2>
        {datPhongList.map(booking => (
          <div key={booking.idDatPhong}>
            <strong>#{booking.idDatPhong}</strong> - 
            Phòng: {booking.idPhong} - 
            Khách: {booking.idKh} - 
            Trạng thái: {booking.trangThai}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompleteBookingExample
```

## Kết luận

API DatPhong cung cấp đầy đủ các chức năng CRUD và tìm kiếm cho việc quản lý đặt phòng. Sử dụng Custom Hook `useDatPhong` giúp quản lý state và xử lý lỗi dễ dàng hơn. Component `BookingList` có thể tái sử dụng để hiển thị danh sách đặt phòng ở nhiều nơi khác nhau.
