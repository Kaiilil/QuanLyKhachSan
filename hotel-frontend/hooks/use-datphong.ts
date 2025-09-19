import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import {
  getAllDatPhong,
  getDatPhongById,
  createDatPhong,
  updateDatPhong,
  deleteDatPhong,
  findDatPhongByKhachHang,
  findDatPhongByPhong,
  findDatPhongByTrangThai,
  getDatPhongHienTai,
  getDatPhongTuongLai,
  getDatPhongQuaKhu,
  type DatPhongDTO,
  type DatPhongCreateRequest
} from "@/lib/datphong-api"

export function useDatPhong() {
  const [datPhongList, setDatPhongList] = useState<DatPhongDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lấy tất cả đặt phòng
  const fetchAllDatPhong = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllDatPhong()
      setDatPhongList(data)
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tải danh sách đặt phòng"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy đặt phòng theo ID
  const fetchDatPhongById = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDatPhongById(id)
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tải thông tin đặt phòng"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Tạo đặt phòng mới
  const addDatPhong = useCallback(async (datPhong: DatPhongCreateRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newDatPhong = await createDatPhong(datPhong)
      setDatPhongList(prev => [...prev, newDatPhong])
      toast({
        title: "Thành công",
        description: "Đã tạo đặt phòng mới"
      })
      return newDatPhong
    } catch (err: any) {
      const message = err.message || "Không thể tạo đặt phòng"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Cập nhật đặt phòng
  const updateDatPhongById = useCallback(async (id: number, updates: Partial<DatPhongDTO>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedDatPhong = await updateDatPhong(id, updates)
      setDatPhongList(prev => 
        prev.map(item => item.idDatPhong === id ? updatedDatPhong : item)
      )
      toast({
        title: "Thành công",
        description: "Đã cập nhật đặt phòng"
      })
      return updatedDatPhong
    } catch (err: any) {
      const message = err.message || "Không thể cập nhật đặt phòng"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Xóa đặt phòng
  const removeDatPhong = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await deleteDatPhong(id)
      setDatPhongList(prev => prev.filter(item => item.idDatPhong !== id))
      toast({
        title: "Thành công",
        description: "Đã xóa đặt phòng"
      })
    } catch (err: any) {
      const message = err.message || "Không thể xóa đặt phòng"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Tìm đặt phòng theo khách hàng
  const searchByKhachHang = useCallback(async (idKh: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await findDatPhongByKhachHang(idKh)
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tìm đặt phòng theo khách hàng"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Tìm đặt phòng theo phòng
  const searchByPhong = useCallback(async (idPhong: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await findDatPhongByPhong(idPhong)
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tìm đặt phòng theo phòng"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Tìm đặt phòng theo trạng thái
  const searchByTrangThai = useCallback(async (trangThai: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await findDatPhongByTrangThai(trangThai)
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tìm đặt phòng theo trạng thái"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy đặt phòng hiện tại
  const fetchDatPhongHienTai = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDatPhongHienTai()
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tải đặt phòng hiện tại"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy đặt phòng tương lai
  const fetchDatPhongTuongLai = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDatPhongTuongLai()
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tải đặt phòng tương lai"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy đặt phòng quá khứ
  const fetchDatPhongQuaKhu = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDatPhongQuaKhu()
      return data
    } catch (err: any) {
      const message = err.message || "Không thể tải đặt phòng quá khứ"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Xóa lỗi
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    datPhongList,
    loading,
    error,
    fetchAllDatPhong,
    fetchDatPhongById,
    addDatPhong,
    updateDatPhongById,
    removeDatPhong,
    searchByKhachHang,
    searchByPhong,
    searchByTrangThai,
    fetchDatPhongHienTai,
    fetchDatPhongTuongLai,
    fetchDatPhongQuaKhu,
    clearError
  }
}
