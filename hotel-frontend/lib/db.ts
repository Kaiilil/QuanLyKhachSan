"use client"

import { readJSON, writeJSON } from "./storage"
import type { Booking, Payment, RoomType, User } from "./types"

const K_SESSION = "hotel_session"
const K_TOKEN = "hotel_token"
const API_BASE: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

type SessionShape = {
  username: string
  email: string | null
  userId: number | null
  role: "USER" | "ADMIN" | null
}

function getToken(): string | null {
  try {
    if (typeof window === "undefined") return null
    return window.localStorage.getItem(K_TOKEN)
  } catch {
    return null
  }
}

function toHeadersObject(h?: HeadersInit): Record<string, string> {
  const obj: Record<string, string> = {}
  if (!h) return obj
  if (h instanceof Headers) {
    for (const [k, v] of h.entries()) obj[k] = v
    return obj
  }
  if (Array.isArray(h)) {
    for (const [k, v] of h) obj[k] = v
    return obj
  }
  return { ...(h as Record<string, string>) }
}

async function apiFetch(input: string, init: RequestInit = {}) {
  const token = getToken()
  const baseHeaders: Record<string, string> = { "Content-Type": "application/json" }
  const merged = { ...baseHeaders, ...toHeadersObject(init.headers) }
  if (token) merged["Authorization"] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${input.startsWith("/") ? input : `/${input}`}`, {
    ...init,
    headers: merged,
  })
  return res
}

export function getCurrentUser(): User | null {
  const session = readJSON<SessionShape | null>(K_SESSION, null)
  if (!session || !session.username || !session.role) return null
  const role = session.role === "ADMIN" ? "ADMIN" : "USER"
  const user: User = {
    id: String(session.userId ?? session.username),
    username: session.username,
    email: session.email || `${session.username}@example.com`,
    password: "",
    role,
  }
  return user
}

export async function validateAndSyncSession(): Promise<User | null> {
  const token = getToken()
  if (!token) return null
  try {
    const res = await apiFetch("api/auth/validate", { method: "GET" })
    const data = await res.json()
    if (!res.ok || data?.success !== true) return null
    const roleName: string | null = data.roleName || null
    const mappedRole: "USER" | "ADMIN" | null = roleName === "ADMIN" ? "ADMIN" : roleName === "USER" ? "USER" : null
    writeJSON(K_SESSION, {
      username: data.username,
      email: data.email ?? null,
      userId: data.userId ?? null,
      role: mappedRole,
    } as SessionShape)
    return getCurrentUser()
  } catch {
    return null
  }
}

export function signOut() {
  writeJSON(K_SESSION, null)
  try {
    if (typeof window !== "undefined") window.localStorage.removeItem(K_TOKEN)
  } catch {}
}

// Force refresh session - useful when switching accounts
export function forceRefreshSession() {
  // Trigger storage event to notify all useSession hooks
  if (typeof window !== "undefined") {
    window.dispatchEvent(new StorageEvent("storage", {
      key: K_SESSION,
      newValue: null
    }))
  }
}

export async function signIn(username: string, password: string) {
  // Clear session cũ trước khi đăng nhập mới
  signOut()
  
  const res = await apiFetch("api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok || data?.success !== true || !data?.token) {
    throw new Error(data?.message || "Đăng nhập thất bại")
  }
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(K_TOKEN, data.token)
  } catch {}
  const roleName: string | null = data.roleName || null
  const mappedRole: "USER" | "ADMIN" | null = roleName === "ADMIN" ? "ADMIN" : roleName === "USER" ? "USER" : null
  writeJSON(K_SESSION, {
    username: data.username,
    email: data.email ?? null,
    userId: data.userId ?? null,
    role: mappedRole,
  } as SessionShape)
  
  // Force refresh session to notify all components
  forceRefreshSession()
}

export async function signUp(payload: { username: string; email: string; password: string; soDienThoai: string; diaChi: string }) {
  // Clear session cũ trước khi đăng ký mới
  signOut()
  
  const res = await apiFetch("api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok || data?.success !== true) {
    throw new Error(data?.message || "Đăng ký thất bại")
  }
  // Auto-login: lưu token nếu trả về
  if (data?.token) {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(K_TOKEN, data.token)
    } catch {}
    const roleName: string | null = data.roleName || null
    const mappedRole: "USER" | "ADMIN" | null = roleName === "ADMIN" ? "ADMIN" : roleName === "USER" ? "USER" : null
    writeJSON(K_SESSION, {
      username: data.username,
      email: data.email ?? null,
      userId: data.userId ?? null,
      role: mappedRole,
    } as SessionShape)
    
    // Force refresh session to notify all components
    forceRefreshSession()
  }
}

export async function updateProfile(userId: string, data: Partial<User>) {
  // Map theo UsersDTO mở rộng: idUser, username, email, soDienThoai, diaChi
  const body: any = {
    idUser: Number(userId),
    username: data.username,
    email: data.email,
    soDienThoai: data.phone,
    diaChi: data.address,
  }
  const res = await apiFetch(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || "Cập nhật thất bại")
  }
  // Sau khi cập nhật email/username, đồng bộ lại session nếu cần
  await validateAndSyncSession()
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const res = await apiFetch(`/api/users/${userId}/change-password`, {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Đổi mật khẩu thất bại")
  }
}

export function getUsers(): User[] {
  return []
}

export function setUserRole(_userId: string, _role: "USER" | "ADMIN") {
  throw new Error("Chưa kết nối với backend")
}

export function setUserLocked(_userId: string, _locked: boolean) {
  throw new Error("Chưa kết nối với backend")
}

export function upsertAdmin(_payload: {
  email: string
  username: string
  password: string
  fullName?: string
}) {
  throw new Error("Chưa kết nối với backend")
}

// Room Types
export async function getRoomTypes(): Promise<RoomType[]> {
  try {
    const res = await apiFetch("api/loaiphong")
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
    const toAbsolute = (p?: string): string | undefined => {
      if (!p) return undefined
      if (p.startsWith("http")) return p
      if (p.startsWith("/uploads/")) return apiBase + p
      if (p.startsWith("uploads/")) return apiBase + "/" + p
      if (p.startsWith("/rooms/")) return apiBase + "/uploads" + p
      if (p.startsWith("rooms/")) return apiBase + "/uploads/" + p
              // Nếu là filename đơn giản (không có path), thử static path
        if (!p.includes("/") && !p.includes("\\")) {
          return `${apiBase}/uploads/rooms/${p}`
        }
        return apiBase + p
      }
    return data.map((x: any) => ({
      id: String(x.idLoaiPhong ?? x.id ?? ""),
      name: x.tenLoaiPhong ?? "",
      price: Number(x.gia ?? 0),
      description: x.moTa ?? "",
      sizeM2: 0,
      capacity: 0,
      view: "",
      images: [],
      amenities: [],
      devices: [],
    }))
  } catch (error) {
    console.warn("Lỗi khi lấy danh sách loại phòng:", error)
    return []
  }
}

export async function getRoomTypeById(id: string): Promise<RoomType | undefined> {
  if (!id) return undefined
  
  try {
    console.log("Gọi API với ID:", id)
    const res = await apiFetch(`api/loaiphong/${id}`)
    
    if (!res.ok) {
      console.warn("API response không OK:", res.status, res.statusText)
      return undefined
    }
    
    const x = await res.json()
    console.log("API response:", x)
    
    if (!x) {
      console.warn("API response rỗng")
      return undefined
    }
    
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
    const toAbsolute = (p?: string): string | undefined => {
      if (!p) return undefined
      if (p.startsWith("http")) return p
      if (p.startsWith("/uploads/")) return apiBase + p
      if (p.startsWith("uploads/")) return apiBase + "/" + p
      if (p.startsWith("/rooms/")) return apiBase + "/uploads" + p
      if (p.startsWith("rooms/")) return apiBase + "/uploads/" + p
      // Nếu là filename đơn giản (không có path), thử static path
      if (!p.includes("/") && !p.includes("\\")) {
        return `${apiBase}/uploads/rooms/${p}`
      }
      return apiBase + p
    }
    
    const firstImgPath: string | undefined = x.hinhAnh || x.anhphong || undefined
    const firstImgAbs: string | undefined = toAbsolute(firstImgPath)
    
    const rt: RoomType = {
      id: String(x.idLoaiPhong ?? x.id ?? id),
      name: x.tenLoaiPhong ?? "",
      price: Number(x.gia ?? 0),
      description: x.moTa ?? "",
      sizeM2: 0,
      capacity: 0,
      view: "",
      images: firstImgAbs ? [firstImgAbs] : [],
      amenities: [],
      devices: [],
    }
    
    console.log("Đã tạo RoomType object:", rt)
    return rt
    
  } catch (error) {
    console.warn("Lỗi khi gọi API getRoomTypeById:", error)
    return undefined
  }
}

export async function searchRoomTypes(opts: {
  query?: string
  maxPrice?: number
  capacity?: number
  amenities?: string[]
}): Promise<RoomType[]> {
  // Tạm thời fetch tất cả và lọc client-side
  const all = await getRoomTypes()
  const q = (opts.query || "").toLowerCase().trim()
  return all.filter((r) => {
    if (q && !(`${r.name} ${r.description}`.toLowerCase().includes(q))) return false
    if (opts.maxPrice != null && r.price > opts.maxPrice) return false
    if (opts.capacity != null && r.capacity < opts.capacity) return false
    if (opts.amenities && opts.amenities.length) {
      const hasAll = opts.amenities.every((a) => r.amenities.includes(a))
      if (!hasAll) return false
    }
    return true
  })
}

export function createRoomType(_payload: Omit<RoomType, "id">) {
  throw new Error("Chưa kết nối với backend")
}

// Backwards-compatible alias used by admin pages
export function addRoomType(payload: Omit<RoomType, "id">) {
  return createRoomType(payload)
}

export async function createRoomTypeAPI(payload: Omit<RoomType, "id">): Promise<RoomType> {
  const res = await apiFetch("api/loaiphong", {
    method: "POST",
    body: JSON.stringify({
      tenLoaiPhong: payload.name,
      gia: payload.price,
      moTa: payload.description,
      hinhAnh: payload.images?.[0] || "",
    }),
  })
  if (!res.ok) throw new Error("Không thể tạo loại phòng")
  const data = await res.json()
  return {
    id: String(data.idLoaiPhong || data.id),
    name: data.tenLoaiPhong || payload.name,
    price: data.gia || payload.price,
    description: data.moTa || payload.description,
    sizeM2: payload.sizeM2 || 0,
    capacity: payload.capacity || 0,
    view: payload.view || "",
    images: data.hinhAnh ? [data.hinhAnh] : payload.images || [],
    amenities: payload.amenities || [],
    devices: payload.devices || [],
  }
}

export function updateRoomType(_id: string, _payload: Partial<RoomType>) {
  throw new Error("Chưa kết nối với backend")
}

export async function updateRoomTypeAPI(id: string, payload: Partial<RoomType>): Promise<RoomType> {
  const res = await apiFetch(`api/loaiphong/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      tenLoaiPhong: payload.name,
      gia: payload.price,
      moTa: payload.description,
      hinhAnh: payload.images?.[0] || "",
    }),
  })
  if (!res.ok) throw new Error("Không thể cập nhật loại phòng")
  const data = await res.json()
  return {
    id: String(data.idLoaiPhong || data.id),
    name: data.tenLoaiPhong || payload.name || "",
    price: data.gia || payload.price || 0,
    description: data.moTa || payload.description || "",
    sizeM2: payload.sizeM2 || 0,
    capacity: payload.capacity || 0,
    view: payload.view || "",
    images: data.hinhAnh ? [data.hinhAnh] : payload.images || [],
    amenities: payload.amenities || [],
    devices: payload.devices || [],
  }
}

export function deleteRoomType(_id: string) {
  throw new Error("Chưa kết nối với backend")
}

export async function deleteRoomTypeAPI(id: string): Promise<void> {
  const res = await apiFetch(`api/loaiphong/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Không thể xóa loại phòng")
}

// Bookings
export function createBooking(_payload: Omit<Booking, "id" | "status" | "createdAt"> & { status?: Booking["status"] }) {
  throw new Error("Chưa kết nối với backend")
}

export function getBookingsByUser(_userId: string): Booking[] {
  return []
}

export function getAllBookings(): Booking[] {
  return []
}

export function cancelBooking(_bookingId: string, _userId: string) {
  throw new Error("Chưa kết nối với backend")
}

export function updateBookingStatus(_bookingId: string, _status: Booking["status"]) {
  throw new Error("Chưa kết nối với backend")
}

// Backwards-compatible alias used by some admin pages
export function setBookingStatus(bookingId: string, status: Booking["status"]) {
  return updateBookingStatus(bookingId, status)
}

// Payments
export function getAllPayments(): Payment[] {
  return []
}

export function createPayment(_payload: Omit<Payment, "id" | "paidAt">) {
  throw new Error("Chưa kết nối với backend")
}

// Temporary placeholder to satisfy callers until backend is wired
export async function confirmPayment(_bookingId: string, _method: Payment["method"]) {
  // TODO: Replace with POST /api/thanhtoan + update booking status
  return
}