const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export type KhachHangDTO = {
  idKh?: number
  hoTen: string
  cccd?: string
  soDienThoai?: string
  email?: string
  diaChi?: string
}

export async function getAllKhachHang(): Promise<KhachHangDTO[]> {
  const res = await fetch(`${API_BASE}/api/khachhang`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được khách hàng")
  return res.json()
}

export async function getKhachHangById(id: number): Promise<KhachHangDTO> {
  const res = await fetch(`${API_BASE}/api/khachhang/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được khách hàng")
  return res.json()
}

export async function createKhachHang(dto: Omit<KhachHangDTO, "idKh">): Promise<KhachHangDTO> {
  const res = await fetch(`${API_BASE}/api/khachhang`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (!res.ok) throw await friendlyError(res, "Tạo khách hàng thất bại")
  return res.json()
}

export async function updateKhachHang(id: number, patch: Partial<KhachHangDTO>): Promise<KhachHangDTO> {
  const res = await fetch(`${API_BASE}/api/khachhang/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw await friendlyError(res, "Cập nhật khách hàng thất bại")
  return res.json()
}

export async function deleteKhachHang(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/khachhang/${id}`, { method: "DELETE" })
  if (!res.ok) throw await friendlyError(res, "Xóa khách hàng thất bại")
}

export async function searchKhachHang(keyword: string): Promise<KhachHangDTO[]> {
  const res = await fetch(`${API_BASE}/api/khachhang/search/keyword?keyword=${encodeURIComponent(keyword)}`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export async function countKhachHang(): Promise<number> {
  const res = await fetch(`${API_BASE}/api/khachhang/count`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không đếm được khách hàng")
  return res.json()
}

async function friendlyError(res: Response, fallback: string): Promise<Error> {
  try {
    const ct = res.headers.get("content-type") || ""
    if (ct.includes("application/json")) {
      const j = await res.json()
      return new Error(j?.message || j?.error || j?.detail || fallback)
    } else {
      const t = await res.text()
      return new Error(t || fallback)
    }
  } catch {
    return new Error(fallback)
  }
}


