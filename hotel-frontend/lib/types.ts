export type Role = "USER" | "ADMIN"

export type User = {
  id: string
  username: string
  email: string
  password: string // demo only, do NOT store plain text in production
  role: Role
  fullName?: string
  phone?: string
  address?: string
  locked?: boolean
}

export type RoomType = {
  id: string
  name: string
  price: number
  description: string
  sizeM2: number
  capacity: number
  view: string
  images: string[]
  amenities: string[] // tiện ích
  devices: string[] // thiết bị
  companyId?: string
  unitId?: string
}

export type BookingStatus = "Chờ xử lý" | "Đã xác nhận" | "Đã huỷ" | "Đã thanh toán"

export type Booking = {
  id: string
  userId: string
  roomTypeId: string
  checkIn: string // ISO date
  checkOut: string // ISO date
  quantity: number
  totalAmount: number
  status: BookingStatus
  createdAt: string
}

export type Payment = {
  id: string
  bookingId: string
  amount: number
  method: "MOMO" | "ZALOPAY" | "VNPAY" | "CREDIT_CARD"
  status: "success" | "failed"
  paidAt: string
}
