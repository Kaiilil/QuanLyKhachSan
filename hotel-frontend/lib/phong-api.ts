const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export type PhongDTO = {
  idPhong: number
  tenPhong: string
  idTang: number
  idLoaiPhong: number
  idDvi: number
  anhPhong?: string
  trangThai: string
}

export type PhongThietBiItem = { id: number; idTb: number; soLuong: number }

export type PhongDetailDTO = PhongDTO & {
  tenTang?: string
  tenLoaiPhong?: string
  gia?: number
  moTa?: string
  tenDvi?: string
  maCty?: string
  tenCty?: string
  danhSachThietBi?: PhongThietBiItem[]
}

export async function getAllPhong(): Promise<PhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được danh sách phòng")
  return res.json()
}

export async function getAllPhongDetail(): Promise<PhongDetailDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong/detail`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được danh sách phòng chi tiết")
  return res.json()
}

export async function getPhongById(id: number): Promise<PhongDTO> {
  const res = await fetch(`${API_BASE}/api/phong/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được phòng")
  return res.json()
}

export async function getPhongDetailById(id: number): Promise<PhongDetailDTO> {
  const res = await fetch(`${API_BASE}/api/phong/${id}/detail`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được phòng chi tiết")
  return res.json()
}

export async function findRoomsByRoomType(idLoaiPhong: number): Promise<PhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong/search/loaiphong/${idLoaiPhong}`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function createPhongWithImage(payload: {
  tenPhong: string
  idTang: number
  idLoaiPhong: number
  idDvi: number
  trangThai: string
  file: File
}): Promise<PhongDTO> {
  const form = new FormData()
  form.append("tenPhong", payload.tenPhong)
  form.append("idTang", String(payload.idTang))
  form.append("idLoaiPhong", String(payload.idLoaiPhong))
  form.append("idDvi", String(payload.idDvi))
  form.append("trangThai", payload.trangThai)
  form.append("file", payload.file)

  const res = await fetch(`${API_BASE}/api/phong`, { method: "POST", body: form })
  if (!res.ok) throw new Error("Tạo phòng thất bại")
  return res.json()
}

export async function updatePhong(id: number, dto: Partial<PhongDTO>): Promise<PhongDTO> {
  const res = await fetch(`${API_BASE}/api/phong/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (!res.ok) throw new Error("Cập nhật phòng thất bại")
  return res.json()
}

export async function deletePhong(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/phong/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Xóa phòng thất bại")
}

export async function searchPhongByTen(tenPhong: string): Promise<PhongDTO | null> {
  const res = await fetch(`${API_BASE}/api/phong/search/ten?tenPhong=${encodeURIComponent(tenPhong)}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export async function searchPhongByTrangThai(trangThai: string): Promise<PhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong/search/trangthai?trangThai=${encodeURIComponent(trangThai)}`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export async function findAvailableRooms(): Promise<PhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong/available`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function findBookedRooms(): Promise<PhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong/booked`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function findOccupiedRooms(): Promise<PhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong/occupied`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function findMaintenanceRooms(): Promise<PhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/phong/maintenance`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export async function countAllPhong(): Promise<number> {
  const res = await fetch(`${API_BASE}/api/phong/count`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không đếm được phòng")
  return res.json()
}


