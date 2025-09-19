import { toast } from "@/hooks/use-toast"

export interface ThanhToanDTO {
  idTt?: number
  idDatPhong?: number
  ngayTt?: string
  ngayDat?: string
  ngayTra?: string
  soTien?: number
  hinhThucTt?: string
  trangThai?: string
}

export interface ThanhToanCreateRequest {
  idDatPhong: number
  ngayTt?: string
  ngayDat: string
  ngayTra: string
  soTien: number
  hinhThucTt?: string
  trangThai?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Lấy tất cả thanh toán
export async function getAllThanhToan(): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching thanh toán:", error)
    throw new Error(`Không thể tải danh sách thanh toán: ${error.message}`)
  }
}

// Lấy thanh toán theo ID
export async function getThanhToanById(id: number): Promise<ThanhToanDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching thanh toán:", error)
    throw new Error(`Không thể tải thông tin thanh toán: ${error.message}`)
  }
}

// Tạo thanh toán mới
export async function createThanhToan(data: ThanhToanCreateRequest): Promise<ThanhToanDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idDatPhong: data.idDatPhong,
        ngayTt: data.ngayTt || new Date().toISOString().split('T')[0],
        ngayDat: data.ngayDat,
        ngayTra: data.ngayTra,
        soTien: data.soTien,
        hinhThucTt: data.hinhThucTt || "payment",
        trangThai: data.trangThai || "Đang xử lý"
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error creating thanh toán:", error)
    throw new Error(`Không thể tạo thanh toán: ${error.message}`)
  }
}

// Cập nhật thanh toán
export async function updateThanhToan(id: number, data: Partial<ThanhToanDTO>): Promise<ThanhToanDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error updating thanh toán:", error)
    throw new Error(`Không thể cập nhật thanh toán: ${error.message}`)
  }
}

// Xóa thanh toán
export async function deleteThanhToan(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error: any) {
    console.warn("Error deleting thanh toán:", error)
    throw new Error(`Không thể xóa thanh toán: ${error.message}`)
  }
}

// Lấy thanh toán theo đặt phòng
export async function getThanhToanByDatPhong(idDatPhong: number): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/datphong/${idDatPhong}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching thanh toán by dat phong:", error)
    throw new Error(`Không thể tải thanh toán theo đặt phòng: ${error.message}`)
  }
}

// Lấy thanh toán theo trạng thái
export async function getThanhToanByTrangThai(trangThai: string): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/trangthai/${encodeURIComponent(trangThai)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching thanh toán by trang thai:", error)
    throw new Error(`Không thể tải thanh toán theo trạng thái: ${error.message}`)
  }
}

// Lấy thanh toán đã hoàn thành
export async function getThanhToanCompleted(): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/hoanthanh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching completed thanh toán:", error)
    throw new Error(`Không thể tải thanh toán đã hoàn thành: ${error.message}`)
  }
}

// Lấy thanh toán đang xử lý
export async function getThanhToanPending(): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/dangxuly`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching pending thanh toán:", error)
    throw new Error(`Không thể tải thanh toán đang xử lý: ${error.message}`)
  }
}

// Lấy thanh toán hôm nay
export async function getThanhToanToday(): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/homnay`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching today's thanh toán:", error)
    throw new Error(`Không thể tải thanh toán hôm nay: ${error.message}`)
  }
}

// Lấy tổng số tiền thanh toán
export async function getTotalAmount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/tongtien`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching total amount:", error)
    throw new Error(`Không thể tải tổng số tiền: ${error.message}`)
  }
}

// Tìm kiếm thanh toán
export async function searchThanhToan(keyword: string): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/search?keyword=${encodeURIComponent(keyword)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error searching thanh toán:", error)
    throw new Error(`Không thể tìm kiếm thanh toán: ${error.message}`)
  }
}

// Lấy thanh toán theo ngày cụ thể (YYYY-MM-DD)
export async function getThanhToanByDate(date: string): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/ngay/${encodeURIComponent(date)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching thanh toán by date:", error)
    throw new Error(`Không thể tải thanh toán theo ngày: ${error.message}`)
  }
}

// Lấy thanh toán theo khoảng thời gian [startDate, endDate] dạng YYYY-MM-DD
export async function getThanhToanBetween(startDate: string, endDate: string): Promise<ThanhToanDTO[]> {
  try {
    const params = new URLSearchParams({ startDate, endDate })
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/thoigian?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching thanh toán between dates:", error)
    throw new Error(`Không thể tải thanh toán theo khoảng thời gian: ${error.message}`)
  }
}

// Lấy thanh toán trong tháng hiện tại
export async function getThanhToanThisMonth(): Promise<ThanhToanDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/thanhtoan/thangnay`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching this month payments:", error)
    throw new Error(`Không thể tải thanh toán tháng này: ${error.message}`)
  }
}