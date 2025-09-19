export type ThietBiDTO = {
  idTb?: number
  tenTb: string
  moTa?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export async function getAllThietBi(): Promise<ThietBiDTO[]> {
  const res = await fetch(`${API_BASE}/api/thietbi`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được thiết bị")
  return res.json()
}

export async function getThietBiById(id: number): Promise<ThietBiDTO> {
  const res = await fetch(`${API_BASE}/api/thietbi/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được thiết bị")
  return res.json()
}

export async function createThietBi(dto: Omit<ThietBiDTO, "idTb">): Promise<ThietBiDTO> {
  const res = await fetch(`${API_BASE}/api/thietbi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (!res.ok) throw await friendlyError(res, "Thêm thiết bị thất bại")
  return res.json()
}

export async function updateThietBi(id: number, patch: Partial<ThietBiDTO>): Promise<ThietBiDTO> {
  const res = await fetch(`${API_BASE}/api/thietbi/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw await friendlyError(res, "Cập nhật thiết bị thất bại")
  return res.json()
}

export async function deleteThietBi(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/thietbi/${id}`, { method: "DELETE" })
  if (!res.ok) throw await friendlyError(res, "Xóa thiết bị thất bại")
}

export async function searchThietBi(keyword: string): Promise<ThietBiDTO[]> {
  const res = await fetch(`${API_BASE}/api/thietbi/search?keyword=${encodeURIComponent(keyword)}`, { cache: "no-store" })
  if (!res.ok) return []
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


