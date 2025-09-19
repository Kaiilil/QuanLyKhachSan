const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export type DatPhongDTO = {
  idDatPhong?: number
  idPhong: number
  idKh: number
  ngayDat: string // ISO date string
  ngayTra: string // ISO date string
  trangThai?: string
}

export type DatPhongCreateRequest = Omit<DatPhongDTO, 'idDatPhong'>

// Lấy tất cả đặt phòng
export async function getAllDatPhong(): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được danh sách đặt phòng")
  return res.json()
}

// Lấy tất cả đặt phòng với thông tin chi tiết
export async function getAllDatPhongDetail(): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/detail`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được danh sách đặt phòng chi tiết")
  return res.json()
}

// Lấy đặt phòng theo ID
export async function getDatPhongById(id: number): Promise<DatPhongDTO | null> {
  try {
    const res = await fetch(`${API_BASE}/api/datphong/${id}`, { cache: "no-store" })
    if (!res.ok) {
      if (res.status === 404) {
        // Không tìm thấy đặt phòng - không phải lỗi
        console.log(`Đặt phòng #${id} không tồn tại`)
        return null
      } else {
        // Lỗi hệ thống thực sự
        console.warn(`API endpoint /api/datphong/${id} returned ${res.status}: ${res.statusText}`)
        throw new Error(`Lỗi hệ thống: ${res.status} ${res.statusText}`)
      }
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching dat phong by ID:", error)
    throw error
  }
}

// Lấy đặt phòng theo ID với thông tin chi tiết
export async function getDatPhongDetailById(id: number): Promise<DatPhongDTO> {
  const res = await fetch(`${API_BASE}/api/datphong/${id}/detail`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được thông tin đặt phòng chi tiết")
  return res.json()
}

// Tạo đặt phòng mới
export async function createDatPhong(datPhong: DatPhongCreateRequest): Promise<DatPhongDTO> {
  const res = await fetch(`${API_BASE}/api/datphong`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datPhong),
  })
  if (!res.ok) throw new Error("Tạo đặt phòng thất bại")
  return res.json()
}

// Cập nhật đặt phòng
export async function updateDatPhong(id: number, datPhong: Partial<DatPhongDTO>): Promise<DatPhongDTO> {
  const res = await fetch(`${API_BASE}/api/datphong/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datPhong),
  })
  if (!res.ok) throw new Error("Cập nhật đặt phòng thất bại")
  return res.json()
}

// Xóa đặt phòng
export async function deleteDatPhong(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/datphong/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Xóa đặt phòng thất bại")
}

// Tìm đặt phòng theo khách hàng
export async function findDatPhongByKhachHang(idKh: number): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/khachhang/${idKh}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo khách hàng")
  return res.json()
}

// Tìm đặt phòng theo phòng
export async function findDatPhongByPhong(idPhong: number): Promise<DatPhongDTO[]> {
  try {
    const res = await fetch(`${API_BASE}/api/datphong/search/phong/${idPhong}`, { cache: "no-store" })
    if (!res.ok) {
      console.warn(`API endpoint /api/datphong/search/phong/${idPhong} returned ${res.status}: ${res.statusText}`)
      // Trả về mảng rỗng thay vì throw error để không làm crash modal
      return []
    }
    return res.json()
  } catch (error) {
    console.warn("Error fetching dat phong by phong:", error)
    // Trả về mảng rỗng thay vì throw error
    return []
  }
}

// Tìm đặt phòng theo trạng thái
export async function findDatPhongByTrangThai(trangThai: string): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/trangthai?trangThai=${encodeURIComponent(trangThai)}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo trạng thái")
  return res.json()
}

// Lấy đặt phòng hiện tại
export async function getDatPhongHienTai(): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/current`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được đặt phòng hiện tại")
  return res.json()
}

// Lấy đặt phòng tương lai
export async function getDatPhongTuongLai(): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/upcoming`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được đặt phòng tương lai")
  return res.json()
}

// Lấy đặt phòng quá khứ
export async function getDatPhongQuaKhu(): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/completed`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không lấy được đặt phòng quá khứ")
  return res.json()
}

// Tìm đặt phòng theo khách hàng và sắp xếp theo ngày đặt
export async function findDatPhongByKhachHangOrderByNgayDat(idKh: number): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/khachhang-sort/${idKh}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo khách hàng")
  return res.json()
}

// Tìm đặt phòng theo phòng và sắp xếp theo ngày đặt
export async function findDatPhongByPhongOrderByNgayDat(idPhong: number): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/phong-sort/${idPhong}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo phòng")
  return res.json()
}

// Tìm đặt phòng theo mã công ty
export async function findDatPhongByCongTy(maCty: string): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/congty/${maCty}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo công ty")
  return res.json()
}

// Tìm đặt phòng theo mã công ty và trạng thái
export async function findDatPhongByCongTyAndTrangThai(maCty: string, trangThai: string): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/congty-trangthai?maCty=${encodeURIComponent(maCty)}&trangThai=${encodeURIComponent(trangThai)}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo công ty và trạng thái")
  return res.json()
}

// Tìm đặt phòng theo đơn vị
export async function findDatPhongByDonVi(idDvi: number): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/donvi/${idDvi}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo đơn vị")
  return res.json()
}

// Tìm đặt phòng theo tầng
export async function findDatPhongByTang(idTang: number): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/tang/${idTang}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo tầng")
  return res.json()
}

// Tìm đặt phòng theo loại phòng
export async function findDatPhongByLoaiPhong(idLoaiPhong: number): Promise<DatPhongDTO[]> {
  const res = await fetch(`${API_BASE}/api/datphong/search/loaiphong/${idLoaiPhong}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không tìm được đặt phòng theo loại phòng")
  return res.json()
}

// Đếm tổng số đặt phòng
export async function countAllDatPhong(): Promise<number> {
  const res = await fetch(`${API_BASE}/api/datphong/count`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không đếm được tổng số đặt phòng")
  return res.json()
}

// Đếm đặt phòng theo khách hàng
export async function countDatPhongByKhachHang(idKh: number): Promise<number> {
  const res = await fetch(`${API_BASE}/api/datphong/count/khachhang/${idKh}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không đếm được đặt phòng theo khách hàng")
  return res.json()
}

// Đếm đặt phòng theo phòng
export async function countDatPhongByPhong(idPhong: number): Promise<number> {
  const res = await fetch(`${API_BASE}/api/datphong/count/phong/${idPhong}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Không đếm được đặt phòng theo phòng")
  return res.json()
}
