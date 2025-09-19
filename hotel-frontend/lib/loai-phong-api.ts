const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export type LoaiPhong = {
  idLoaiPhong: number;
  tenLoaiPhong: string;
  gia: number;
  moTa: string;
  anhphong?: string;
  hinhAnh?: string;
};

// Lấy tất cả loại phòng
export async function getAllLoaiPhong(): Promise<LoaiPhong[]> {
  try {
    console.log("Gọi API getAllLoaiPhong tại:", `${API_BASE}/api/loaiphong`)
    const res = await fetch(`${API_BASE}/api/loaiphong`);
    if (!res.ok) {
      console.warn("API response không OK:", res.status, res.statusText)
      // Trả về mảng rỗng thay vì throw error để không làm crash ứng dụng
      return []
    }
    return res.json();
  } catch (error: any) {
    console.warn("Lỗi khi gọi getAllLoaiPhong:", error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.warn("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.");
    }
    // Trả về mảng rỗng thay vì throw error
    return []
  }
}

// Lấy loại phòng theo ID
export async function getLoaiPhongById(id: number): Promise<LoaiPhong> {
  const res = await fetch(`${API_BASE}/api/loaiphong/${id}`);
  if (!res.ok) throw new Error("Không lấy được loại phòng");
  return res.json();
}

// Tạo loại phòng mới
export async function createLoaiPhong(data: Omit<LoaiPhong, "idLoaiPhong">): Promise<LoaiPhong> {
  // Đảm bảo định dạng phù hợp cho BigDecimal và các trường khác
  const payload: any = {
    tenLoaiPhong: data.tenLoaiPhong,
    gia: typeof data.gia === "number" ? String(data.gia) : String(data.gia),
    moTa: data.moTa ?? "",
    hinhAnh: data.hinhAnh ?? null,
  }
  const res = await fetch(`${API_BASE}/api/loaiphong`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    try {
      const ct = res.headers.get("content-type") || ""
      if (ct.includes("application/json")) {
        const j = await res.json()
        throw new Error(j?.message || j?.error || j?.detail || "Tạo loại phòng thất bại")
      } else {
        const t = await res.text()
        throw new Error(t || "Tạo loại phòng thất bại")
      }
    } catch (e: any) {
      if (e?.message) throw e
      throw new Error("Tạo loại phòng thất bại")
    }
  }
  return res.json()
}

// Cập nhật loại phòng
export async function updateLoaiPhong(id: number, data: Omit<LoaiPhong, "idLoaiPhong">): Promise<LoaiPhong> {
  const payload: any = {
    tenLoaiPhong: data.tenLoaiPhong,
    gia: typeof data.gia === "number" ? String(data.gia) : String(data.gia),
    moTa: data.moTa ?? "",
    hinhAnh: data.hinhAnh ?? null,
  }
  const res = await fetch(`${API_BASE}/api/loaiphong/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    try {
      const ct = res.headers.get("content-type") || ""
      if (ct.includes("application/json")) {
        const j = await res.json()
        throw new Error(j?.message || j?.error || j?.detail || "Cập nhật loại phòng thất bại")
      } else {
        const t = await res.text()
        throw new Error(t || "Cập nhật loại phòng thất bại")
      }
    } catch (e: any) {
      if (e?.message) throw e
      throw new Error("Cập nhật loại phòng thất bại")
    }
  }
  return res.json()
}

// Xóa loại phòng
export async function deleteLoaiPhong(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/loaiphong/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa loại phòng thất bại");
}

// Tìm kiếm theo tên
export async function searchLoaiPhongByTen(tenLoaiPhong: string): Promise<LoaiPhong[]> {
  const res = await fetch(`${API_BASE}/api/loaiphong/search/ten?tenLoaiPhong=${encodeURIComponent(tenLoaiPhong)}`);
  if (!res.ok) throw new Error("Không tìm được loại phòng");
  return res.json();
}

// Tìm kiếm theo từ khóa
export async function searchLoaiPhongByKeyword(keyword: string): Promise<LoaiPhong[]> {
  const res = await fetch(`${API_BASE}/api/loaiphong/search/keyword?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Không tìm được loại phòng");
  return res.json();
}

// Tìm loại phòng theo giá
export async function searchLoaiPhongByGia(gia: number): Promise<LoaiPhong[]> {
  const res = await fetch(`${API_BASE}/api/loaiphong/search/gia?gia=${gia}`);
  if (!res.ok) throw new Error("Không tìm được loại phòng");
  return res.json();
}

// Tìm loại phòng theo khoảng giá
export async function searchLoaiPhongByGiaBetween(minGia: number, maxGia: number): Promise<LoaiPhong[]> {
  const res = await fetch(`${API_BASE}/api/loaiphong/search/gia-between?minGia=${minGia}&maxGia=${maxGia}`);
  if (!res.ok) throw new Error("Không tìm được loại phòng");
  return res.json();
}

// Sắp xếp loại phòng theo giá tăng dần
export async function getLoaiPhongGiaAsc(): Promise<LoaiPhong[]> {
  const res = await fetch(`${API_BASE}/api/loaiphong/sort/gia-asc`);
  if (!res.ok) throw new Error("Không lấy được loại phòng");
  return res.json();
}

// Sắp xếp loại phòng theo giá giảm dần
export async function getLoaiPhongGiaDesc(): Promise<LoaiPhong[]> {
  const res = await fetch(`${API_BASE}/api/loaiphong/sort/gia-desc`);
  if (!res.ok) throw new Error("Không lấy được loại phòng");
  return res.json();
}

// Kiểm tra tồn tại theo tên
export async function existsLoaiPhongByTen(tenLoaiPhong: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/loaiphong/exists/ten?tenLoaiPhong=${encodeURIComponent(tenLoaiPhong)}`);
  if (!res.ok) throw new Error("Không kiểm tra được");
  return res.json();
}

// Đếm tổng số loại phòng
export async function countAllLoaiPhong(): Promise<number> {
  const res = await fetch(`${API_BASE}/api/loaiphong/count`);
  if (!res.ok) throw new Error("Không đếm được loại phòng");
  return res.json();
}
