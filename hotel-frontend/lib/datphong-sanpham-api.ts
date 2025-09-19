import { API_BASE_URL } from './utils'

export interface DatPhongSanPhamDTO {
  idDpSp?: number
  idDatPhong: number
  idSp: number
  soLuong: number
}

export interface SanPhamDTO {
  idSp: number
  tenSp: string
  donGia: number
  moTa: string
}

// Lấy tất cả đặt phòng sản phẩm
export async function getAllDatPhongSanPham(): Promise<DatPhongSanPhamDTO[]> {
  const response = await fetch(`${API_BASE_URL}/datphong-sanpham`)
  if (!response.ok) {
    throw new Error('Không thể tải danh sách đặt phòng sản phẩm')
  }
  return response.json()
}

// Lấy đặt phòng sản phẩm theo ID đặt phòng
export async function getDatPhongSanPhamByDatPhongId(idDatPhong: number): Promise<DatPhongSanPhamDTO[]> {
  const response = await fetch(`${API_BASE_URL}/datphong-sanpham/datphong/${idDatPhong}`)
  if (!response.ok) {
    throw new Error('Không thể tải danh sách sản phẩm cho đặt phòng này')
  }
  return response.json()
}

// Lấy tất cả sản phẩm
export async function getAllSanPham(): Promise<SanPhamDTO[]> {
  const response = await fetch(`${API_BASE_URL}/sanpham`)
  if (!response.ok) {
    throw new Error('Không thể tải danh sách sản phẩm')
  }
  return response.json()
}

// Lấy sản phẩm theo ID
export async function getSanPhamById(idSp: number): Promise<SanPhamDTO> {
  const response = await fetch(`${API_BASE_URL}/sanpham/${idSp}`)
  if (!response.ok) {
    throw new Error('Không thể tải thông tin sản phẩm')
  }
  return response.json()
}

// Tạo đặt phòng sản phẩm mới
export async function createDatPhongSanPham(data: DatPhongSanPhamDTO): Promise<DatPhongSanPhamDTO> {
  const response = await fetch(`${API_BASE_URL}/datphong-sanpham`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Không thể tạo đặt phòng sản phẩm')
  }
  return response.json()
}
