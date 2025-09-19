# API Requirements for Spring Boot Backend

## Authentication APIs

### POST /api/auth/login
- Request: `{ email: string, password: string }`
- Response: `{ token: string, user: User }`

### POST /api/auth/register  
- Request: `{ username: string, email: string, password: string }`
- Response: `{ token: string, user: User }`

### POST /api/auth/logout
- Headers: `Authorization: Bearer <token>`
- Response: `{ success: boolean }`

### GET /api/users/current
- Headers: `Authorization: Bearer <token>`
- Response: `User | null`

## User Management APIs

### GET /api/users
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `User[]`

### PUT /api/users/{userId}
- Headers: `Authorization: Bearer <token>`
- Request: `Partial<User>`
- Response: `User`

### PUT /api/users/{userId}/role
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `{ role: "USER" | "ADMIN" }`
- Response: `User`

### PUT /api/users/{userId}/locked
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `{ locked: boolean }`
- Response: `User`

## Room Types APIs

### GET /api/room-types
- Response: `RoomType[]`

### GET /api/room-types/{id}
- Response: `RoomType | null`

### GET /api/room-types/search
- Query params: `query?, maxPrice?, capacity?, amenities?`
- Response: `RoomType[]`

### POST /api/room-types
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `Omit<RoomType, "id">`
- Response: `RoomType`

### PUT /api/room-types/{id}
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `Partial<RoomType>`
- Response: `RoomType`

### DELETE /api/room-types/{id}
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `{ success: boolean }`

## Booking APIs

### GET /api/bookings
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `Booking[]`

### GET /api/bookings/user/{userId}
- Headers: `Authorization: Bearer <token>`
- Response: `Booking[]`

### POST /api/bookings
- Headers: `Authorization: Bearer <token>`
- Request: `Omit<Booking, "id" | "status" | "createdAt">`
- Response: `Booking`

### PUT /api/bookings/{id}/cancel
- Headers: `Authorization: Bearer <token>`
- Response: `Booking`

### PUT /api/bookings/{id}/status
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `{ status: Booking["status"] }`
- Response: `Booking`

## Payment APIs

### GET /api/payments
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `Payment[]`

### POST /api/payments
- Headers: `Authorization: Bearer <token>`
- Request: `Omit<Payment, "id" | "paidAt">`
- Response: `Payment`

## Admin APIs

### GET /api/companies
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `Company[]`

### GET /api/units
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `Unit[]`

### GET /api/floors
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `Floor[]`

### GET /api/physical-rooms
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `PhysicalRoom[]`

### GET /api/devices
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `Device[]`

### GET /api/room-devices
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `RoomDevice[]`

### GET /api/predictions
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `Prediction[]`

## Data Types

```typescript
type User = {
  id: string
  username: string
  email: string
  password?: string // Không trả về trong response
  role: "USER" | "ADMIN"
  fullName?: string
  phone?: string
  address?: string
  locked?: boolean
}

type RoomType = {
  id: string
  name: string
  price: number
  description: string
  sizeM2: number
  capacity: number
  view: string
  images: string[]
  amenities: string[]
  devices: string[]
}

type Booking = {
  id: string
  userId: string
  roomTypeId: string
  checkIn: string // ISO date
  checkOut: string // ISO date
  quantity: number
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed"
  total: number
  createdAt: string // ISO date
}

type Payment = {
  id: string
  bookingId: string
  amount: number
  method: "Cash" | "Card" | "Transfer"
  status: "Pending" | "Completed" | "Failed"
  paidAt: string // ISO date
}
```

## CORS Configuration
Ensure Spring Boot allows requests from frontend origin (http://localhost:3000 for development).

## Notes
- All dates should be in ISO format
- JWT tokens should be included in Authorization header as "Bearer <token>"
- Admin-only endpoints should verify user role
- Implement proper error handling with meaningful error messages in Vietnamese
