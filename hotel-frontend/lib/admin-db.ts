"use client"

import { readJSON, writeJSON, uid } from "./storage"
import type { RoomType } from "./types"
import { getRoomTypes } from "./db"

export type Company = {
  id: string
  code: string
  name: string
  active: boolean
}

export type Unit = {
  id: string
  name: string
  companyId: string
}

export type Floor = {
  id: string
  name: string
  unitId: string
}

export type PhysicalRoom = {
  id: string
  name: string
  floorId: string
  roomTypeId: string
  unitId: string
  status: "Trống" | "Đang sử dụng" | "Bảo trì"
  imagePath?: string
}

export type Device = {
  id: string
  name: string
}

export type RoomDevice = {
  id: string
  roomId: string
  deviceId: string
  quantity: number
}

export type Prediction = {
  id: string
  month: number
  year: number
  companyId: string
  unitId?: string
  expectedGuests: number
}

// TODO: Replace all these localStorage-based functions with Spring Boot API calls

export async function getCompanies(): Promise<Company[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  console.log("getCompanies called with base URL:", base)
  try {
    const url = `${base}/api/congty`
    console.log("Fetching from:", url)
    const res = await fetch(url, { cache: "no-store" })
    console.log("Response status:", res.status, res.statusText)
    if (!res.ok) {
      console.log("Response not ok, returning empty array")
      return []
    }
    const data = (await res.json()) as Array<{ maCty?: string | null; tenCty?: string | null }>
    console.log("Raw API data:", data)
    const mapped = data.map((c) => {
      const id = String(c.maCty ?? "").trim()
      const name = String(c.tenCty ?? "").trim()
      return { id, code: id, name, active: true }
    })
    const result = mapped.filter((c) => c.id !== "")
    console.log("Mapped companies:", result)
    return result
  } catch (error) {
    console.warn("Error in getCompanies:", error)
    return []
  }
}

export async function getUnits(): Promise<Unit[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${base}/api/donvi`, { cache: "no-store" })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{ idDvi: number; tenDvi: string; maCty?: string }>
    return data.map((u) => ({ id: String(u.idDvi), name: u.tenDvi, companyId: String(u.maCty ?? "") }))
  } catch {
    return []
  }
}

export async function getUnitById(id: string): Promise<Unit | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${base}/api/donvi/${encodeURIComponent(id)}`, { cache: "no-store" })
    if (!res.ok) return null
    const dto = (await res.json()) as { idDvi: number; tenDvi: string; maCty?: string }
    return { id: String(dto.idDvi), name: dto.tenDvi, companyId: String(dto.maCty ?? "") }
  } catch {
    return null
  }
}

export async function searchUnitsByName(name: string): Promise<Unit[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${base}/api/donvi/search/ten?tenDvi=${encodeURIComponent(name)}`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{ idDvi: number; tenDvi: string; maCty?: string }>
    return data.map((u) => ({ id: String(u.idDvi), name: u.tenDvi, companyId: String(u.maCty ?? "") }))
  } catch {
    return []
  }
}

export async function searchUnitsByKeyword(keyword: string): Promise<Unit[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${base}/api/donvi/search/keyword?keyword=${encodeURIComponent(keyword)}`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{ idDvi: number; tenDvi: string; maCty?: string }>
    return data.map((u) => ({ id: String(u.idDvi), name: u.tenDvi, companyId: String(u.maCty ?? "") }))
  } catch {
    return []
  }
}

export async function existsUnitName(name: string): Promise<boolean> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${base}/api/donvi/exists/ten?tenDvi=${encodeURIComponent(name)}`, { cache: "no-store" })
    if (!res.ok) return false
    return Boolean(await res.json())
  } catch {
    return false
  }
}

export async function countUnits(): Promise<number> {
  try {
    const units = await getUnits()
    return units.length
  } catch {
    return 0
  }
}

export async function getFloors(): Promise<Floor[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${base}/api/tang`, { cache: "no-store" })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{ idTang: number; tenTang: string; idDvi: number | null }>
    return data.map((t) => ({ id: String(t.idTang), name: t.tenTang, unitId: String(t.idDvi ?? "") }))
  } catch {
    return []
  }
}

export async function getPhysicalRooms(): Promise<PhysicalRoom[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${base}/api/phong`, { cache: "no-store" })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{
      idPhong: number
      tenPhong: string
      idTang: number
      idLoaiPhong: number
      idDvi: number
      trangThai: string
      anhPhong?: string
    }>
    return data.map((p) => ({
      id: String(p.idPhong),
      name: p.tenPhong,
      floorId: String(p.idTang),
      roomTypeId: String(p.idLoaiPhong),
      unitId: String(p.idDvi),
      status: (p.trangThai as any) || "Trống",
      imagePath: p.anhPhong || undefined,
    }))
  } catch {
    return []
  }
}

// Cập nhật trạng thái tất cả phòng dựa trên thời gian thực
export async function updateAllRoomStatus(): Promise<boolean> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const response = await fetch(`${base}/api/phong/update-status-all`, {
      method: 'POST'
    })
    if (!response.ok) {
      console.warn('Failed to update all room status:', response.statusText)
      return false
    }
    return true
  } catch (error) {
    console.warn('Error updating all room status:', error)
    return false
  }
}

// Cập nhật trạng thái một phòng cụ thể
export async function updateRoomStatus(roomId: number): Promise<boolean> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  try {
    const response = await fetch(`${base}/api/phong/${roomId}/update-status`, {
      method: 'POST'
    })
    if (!response.ok) {
      console.warn('Failed to update room status:', response.statusText)
      return false
    }
    return true
  } catch (error) {
    console.warn('Error updating room status:', error)
    return false
  }
}

// Đếm số lượng phòng theo trạng thái
export async function getRoomStatusCounts(): Promise<{
  Trống: number
  "Đang sử dụng": number
  "Bảo trì": number
}> {
  try {
    const rooms = await getPhysicalRooms()
    const counts = {
      Trống: 0,
      "Đang sử dụng": 0,
      "Bảo trì": 0,
    }
    
    rooms.forEach(room => {
      if (room.status in counts) {
        counts[room.status as keyof typeof counts]++
      }
    })
    
    return counts
  } catch (error) {
    console.warn('Error getting room status counts:', error)
    return {
      Trống: 0,
      "Đang sử dụng": 0,
      "Bảo trì": 0,
    }
  }
}

export function getDevices(): Device[] {
  // TODO: Replace with Spring Boot API call
  // Example: GET /api/devices
  return []
}

export function getRoomDevices(): RoomDevice[] {
  // TODO: Replace with Spring Boot API call
  // Example: GET /api/room-devices
  return []
}

export function getPredictions(): Prediction[] {
  // TODO: Replace with Spring Boot API call
  // Example: GET /api/predictions
  return []
}

// Create functions
export async function createCompany(payload: Omit<Company, "id">): Promise<Company> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const res = await fetch(`${base}/api/congty`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ maCty: payload.code, tenCty: payload.name }),
  })
  if (!res.ok) throw new Error("Tạo công ty thất bại")
  const dto = (await res.json()) as { maCty: string; tenCty: string }
  return { id: dto.maCty, code: dto.maCty, name: dto.tenCty, active: payload.active ?? true }
}

// Backwards-compatible aliases used by admin pages
export function addCompany(payload: Omit<Company, "id">) {
  return createCompany(payload)
}
export async function updateCompany(id: string, patch: Partial<Company>): Promise<Company> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const body: any = {}
  if (patch.code != null) body.maCty = patch.code
  if (patch.name != null) body.tenCty = patch.name
  const res = await fetch(`${base}/api/congty/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Cập nhật công ty thất bại")
  const dto = (await res.json()) as { maCty: string; tenCty: string }
  return { id: dto.maCty, code: dto.maCty, name: dto.tenCty, active: true }
}

export async function createUnit(payload: Omit<Unit, "id">): Promise<Unit> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const res = await fetch(`${base}/api/donvi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenDvi: payload.name, maCty: payload.companyId }),
  })
  if (!res.ok) throw new Error("Tạo đơn vị thất bại")
  const dto = (await res.json()) as { idDvi: number; tenDvi: string; maCty?: string }
  return { id: String(dto.idDvi), name: dto.tenDvi, companyId: String(dto.maCty ?? "") }
}

export function addUnit(payload: Omit<Unit, "id">) {
  return createUnit(payload)
}
export async function updateUnit(id: string, patch: Partial<Unit>): Promise<Unit> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const body: any = {}
  if (patch.name != null) body.tenDvi = patch.name
  if (patch.companyId != null) body.maCty = patch.companyId
  const res = await fetch(`${base}/api/donvi/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Cập nhật đơn vị thất bại")
  const dto = (await res.json()) as { idDvi: number; tenDvi: string; maCty?: string }
  return { id: String(dto.idDvi), name: dto.tenDvi, companyId: String(dto.maCty ?? "") }
}

export async function createFloor(payload: Omit<Floor, "id">): Promise<Floor> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const res = await fetch(`${base}/api/tang`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenTang: payload.name, idDvi: Number(payload.unitId) || null }),
  })
  if (!res.ok) throw new Error("Tạo tầng thất bại")
  const dto = (await res.json()) as { idTang: number; tenTang: string; idDvi: number | null }
  return { id: String(dto.idTang), name: dto.tenTang, unitId: String(dto.idDvi ?? "") }
}

export function addFloor(payload: Omit<Floor, "id">) {
  return createFloor(payload)
}
export async function updateFloor(id: string, patch: Partial<Floor>): Promise<Floor> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const body: any = {}
  if (patch.name != null) body.tenTang = patch.name
  if (patch.unitId != null) body.idDvi = Number(patch.unitId) || null
  const res = await fetch(`${base}/api/tang/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Cập nhật tầng thất bại")
  const dto = (await res.json()) as { idTang: number; tenTang: string; idDvi: number | null }
  return { id: String(dto.idTang), name: dto.tenTang, unitId: String(dto.idDvi ?? "") }
}

export async function createPhysicalRoom(payload: Omit<PhysicalRoom, "id"> & { imageFile?: File }) {
  // Backend yêu cầu multipart form-data với file bắt buộc, nhưng để tiện dụng
  // nếu không có ảnh thì tạm thời ném lỗi có hướng dẫn.
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  if (!payload.imageFile) {
    throw new Error("Vui lòng chọn ảnh phòng (backend yêu cầu trường file)")
  }
  const form = new FormData()
  form.append("tenPhong", payload.name)
  form.append("idTang", String(Number(payload.floorId)))
  form.append("idLoaiPhong", String(Number(payload.roomTypeId)))
  form.append("idDvi", String(Number(payload.unitId)))
  form.append("trangThai", payload.status)
  form.append("file", payload.imageFile)
  const res = await fetch(`${base}/api/phong`, { method: "POST", body: form })
  if (!res.ok) throw new Error("Tạo phòng thất bại")
  return res.json()
}

export function createDevice(payload: Omit<Device, "id">) {
  // TODO: Replace with Spring Boot API call
  // Example: POST /api/devices { ...payload }
  throw new Error("Chưa kết nối với backend")
}

export function createRoomDevice(payload: Omit<RoomDevice, "id">) {
  // TODO: Replace with Spring Boot API call
  // Example: POST /api/room-devices { ...payload }
  throw new Error("Chưa kết nối với backend")
}

export function createPrediction(payload: Omit<Prediction, "id">) {
  // TODO: Replace with Spring Boot API call
  // Example: POST /api/predictions { ...payload }
  throw new Error("Chưa kết nối với backend")
}

// Delete functions
export async function deleteCompany(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const res = await fetch(`${base}/api/congty/${encodeURIComponent(id)}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Xóa công ty thất bại")
}

export async function deleteUnit(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const res = await fetch(`${base}/api/donvi/${encodeURIComponent(id)}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Xóa đơn vị thất bại")
}

export async function deleteFloor(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const res = await fetch(`${base}/api/tang/${encodeURIComponent(id)}`, { method: "DELETE" })
  if (!res.ok) {
    let message = "Xóa tầng thất bại"
    try {
      const contentType = res.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const data = await res.json()
        message = data?.message || data?.error || data?.detail || message
      } else {
        const text = await res.text()
        if (text) message = text
      }
    } catch {
      // ignore parsing errors, fallback to default message
    }
    // Friendly message for conflict
    if (res.status === 409 && message === "Xóa tầng thất bại") {
      message = "Không thể xóa tầng vì đang được tham chiếu (ví dụ: còn phòng thuộc tầng này)"
    }
    throw new Error(message)
  }
}

export async function deletePhysicalRoom(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const res = await fetch(`${base}/api/phong/${encodeURIComponent(id)}`, { method: "DELETE" })
  if (!res.ok) {
    let message = "Xóa phòng thất bại"
    try {
      const contentType = res.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const data = await res.json()
        message = data?.message || data?.error || data?.detail || message
      } else {
        const text = await res.text()
        if (text) message = text
      }
    } catch {
      // ignore parsing errors
    }
    if (res.status === 409 && message === "Xóa phòng thất bại") {
      message = "Không thể xóa phòng vì đang được tham chiếu hoặc đang sử dụng"
    }
    throw new Error(message)
  }
}

export function deleteDevice(id: string) {
  // TODO: Replace with Spring Boot API call
  // Example: DELETE /api/devices/${id}
  throw new Error("Chưa kết nối với backend")
}

export function deleteRoomDevice(id: string) {
  // TODO: Replace with Spring Boot API call
  // Example: DELETE /api/room-devices/${id}
  throw new Error("Chưa kết nối với backend")
}

export function deletePrediction(id: string) {
  // TODO: Replace with Spring Boot API call
  // Example: DELETE /api/predictions/${id}
  throw new Error("Chưa kết nối với backend")
}

// Update functions
export async function updatePhysicalRoomStatus(id: string, status: PhysicalRoom["status"]) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const body = { trangThai: status }
  const res = await fetch(`${base}/api/phong/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Cập nhật trạng thái phòng thất bại")
  return res.json()
}

export async function updatePhysicalRoom(id: string, patch: Partial<PhysicalRoom>) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const body: any = {}
  
  // Chỉ gửi các trường có giá trị để tránh mất thông tin
  if (patch.name != null && patch.name.trim() !== "") {
    body.tenPhong = patch.name.trim()
  }
  
  if (patch.floorId != null && patch.floorId !== "") {
    body.idTang = Number(patch.floorId)
  }
  
  if (patch.roomTypeId != null && patch.roomTypeId !== "") {
    body.idLoaiPhong = Number(patch.roomTypeId)
  }
  
  if (patch.unitId != null && patch.unitId !== "") {
    body.idDvi = Number(patch.unitId)
  }
  
  if (patch.status != null) {
    body.trangThai = patch.status
  }
  
  if (patch.imagePath != null) {
    body.anhPhong = patch.imagePath
  }
  
  // Debug log để kiểm tra
  console.log('Updating room with data:', body)
  
  const res = await fetch(`${base}/api/phong/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Cập nhật phòng thất bại")
  return res.json()
}