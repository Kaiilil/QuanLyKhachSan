const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export type PhongThietBiDTO = {
  id: number
  idPhong: number
  idTb: number
  soLuong: number
}

export async function getAllPhongThietBi(): Promise<PhongThietBiDTO[]> {
  const res = await fetch(`${API_BASE}/api/phongthietbi`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được danh sách phòng-thiết bị")
  return res.json()
}

export async function getPhongThietBiById(id: number): Promise<PhongThietBiDTO> {
  const res = await fetch(`${API_BASE}/api/phongthietbi/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được phòng-thiết bị")
  return res.json()
}

export async function createPhongThietBi(dto: Omit<PhongThietBiDTO, 'id'>): Promise<PhongThietBiDTO> {
  const res = await fetch(`${API_BASE}/api/phongthietbi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (!res.ok) throw new Error("Thêm thiết bị vào phòng thất bại")
  return res.json()
}

export async function updatePhongThietBi(id: number, dto: Partial<PhongThietBiDTO>): Promise<PhongThietBiDTO> {
  const res = await fetch(`${API_BASE}/api/phongthietbi/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (!res.ok) throw new Error("Cập nhật phòng-thiết bị thất bại")
  return res.json()
}

export async function deletePhongThietBi(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/phongthietbi/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Xóa thiết bị khỏi phòng thất bại")
}

export async function getPhongThietBiByPhong(idPhong: number): Promise<PhongThietBiDTO[]> {
  const res = await fetch(`${API_BASE}/api/phongthietbi/phong/${idPhong}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được thiết bị trong phòng")
  return res.json()
}

export async function getPhongThietBiByThietBi(idTb: number): Promise<PhongThietBiDTO[]> {
  const res = await fetch(`${API_BASE}/api/phongthietbi/thietbi/${idTb}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được phòng có thiết bị")
  return res.json()
}

export async function getPhongThietBiByPhongAndThietBi(idPhong: number, idTb: number): Promise<PhongThietBiDTO | null> {
  const res = await fetch(`${API_BASE}/api/phongthietbi/phong-thietbi?idPhong=${idPhong}&idTb=${idTb}`, { 
    cache: "no-store" 
  })
  if (!res.ok) return null
  return res.json()
}
