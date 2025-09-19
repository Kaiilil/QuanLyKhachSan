"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useDatPhong } from "@/hooks/use-datphong"
import { getAllPhong, type PhongDTO } from "@/lib/phong-api"
import { getAllKhachHang, type KhachHangDTO } from "@/lib/khachhang-api"
import { getAllSanPham, getDatPhongSanPhamByDatPhongId, type SanPhamDTO, type DatPhongSanPhamDTO } from "@/lib/datphong-sanpham-api"
import { getThanhToanByDatPhong, updateThanhToan, createThanhToan, type ThanhToanDTO } from "@/lib/thanhtoan-api"
import { format } from "date-fns"
import DebugInfo from "@/components/debug-info"

export default function AdminBookingsPage() {
  const router = useRouter()
  const {
    datPhongList,
    loading,
    error,
    fetchAllDatPhong,
    updateDatPhongById,
    removeDatPhong,
    clearError
  } = useDatPhong()

  const [rooms, setRooms] = useState<PhongDTO[]>([])
  const [customers, setCustomers] = useState<KhachHangDTO[]>([])
  const [products, setProducts] = useState<SanPhamDTO[]>([])
  const [bookingProducts, setBookingProducts] = useState<Map<number, DatPhongSanPhamDTO[]>>(new Map())
  const [filterTrangThai, setFilterTrangThai] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [bookingPayments, setBookingPayments] = useState<Map<number, ThanhToanDTO[]>>(new Map())

  useEffect(() => {
    loadReferences()
    fetchAllDatPhong()
  }, [fetchAllDatPhong])

  // Load sản phẩm và thanh toán cho tất cả bookings
  useEffect(() => {
    if (datPhongList.length > 0) {
      loadBookingProducts()
      loadBookingPayments()
    }
  }, [datPhongList])

  async function loadBookingProducts() {
    try {
      const productMap = new Map<number, DatPhongSanPhamDTO[]>()
      
      for (const booking of datPhongList) {
        if (booking.idDatPhong) {
          try {
            const bookingProducts = await getDatPhongSanPhamByDatPhongId(booking.idDatPhong)
            productMap.set(booking.idDatPhong, bookingProducts)
          } catch (error) {
            console.warn(`Không thể tải sản phẩm cho booking ${booking.idDatPhong}:`, error)
            productMap.set(booking.idDatPhong, [])
          }
        }
      }
      
      setBookingProducts(productMap)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải thông tin sản phẩm: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  async function loadBookingPayments() {
    try {
      const paymentMap = new Map<number, ThanhToanDTO[]>()
      
      for (const booking of datPhongList) {
        if (booking.idDatPhong) {
          try {
            const bookingPayments = await getThanhToanByDatPhong(booking.idDatPhong)
            paymentMap.set(booking.idDatPhong, bookingPayments)
          } catch (error) {
            console.warn(`Không thể tải thanh toán cho booking ${booking.idDatPhong}:`, error)
            paymentMap.set(booking.idDatPhong, [])
          }
        }
      }
      
      setBookingPayments(paymentMap)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải thông tin thanh toán: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  async function loadReferences() {
    try {
      const [rs, cs, ps] = await Promise.all([getAllPhong(), getAllKhachHang(), getAllSanPham()])
      setRooms(rs)
      setCustomers(cs)
      setProducts(ps)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải danh sách phòng/khách hàng/sản phẩm: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  async function handleUpdateStatus(id: number, newStatus: string) {
    try {
      // Kiểm tra xem có thể cập nhật trạng thái không
      const booking = datPhongList.find(b => b.idDatPhong === id)
      if (!booking) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy đặt phòng",
          variant: "destructive"
        })
        return
      }

      const currentStatus = booking.trangThai || "Chờ xử lý"
      
      // Chỉ cho phép thay đổi từ "Chờ xử lý" sang "Đã xác nhận" hoặc "Đã hủy"
      if (currentStatus !== "Chờ xử lý") {
        toast({
          title: "Không thể cập nhật",
          description: "Chỉ có thể thay đổi trạng thái khi đang ở trạng thái 'Chờ xử lý'",
          variant: "destructive"
        })
        return
      }

      // Chỉ cho phép thay đổi sang "Đã xác nhận" hoặc "Đã hủy"
      if (newStatus !== "Đã xác nhận" && newStatus !== "Đã hủy") {
        toast({
          title: "Không thể cập nhật",
          description: "Chỉ có thể thay đổi sang 'Đã xác nhận' hoặc 'Đã hủy'",
          variant: "destructive"
        })
        return
      }

      // Cập nhật trạng thái đặt phòng
      await updateDatPhongById(id, { trangThai: newStatus })
      
      // Đồng bộ trạng thái thanh toán nếu có
      const payments = getBookingPayments(id)
      if (payments.length > 0) {
        const latestPayment = payments[payments.length - 1]
        
        // Map trạng thái đặt phòng sang trạng thái thanh toán
        let paymentStatus = "Chờ thanh toán"
        if (newStatus === "Đã hủy") {
          paymentStatus = "Đã hủy"
        }
        
        // Cập nhật trạng thái thanh toán
        await updateThanhToan(latestPayment.idTt!, { trangThai: paymentStatus })
      }
      
      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái đặt phòng thành '${newStatus}'`
      })
      
      // Reload data để cập nhật UI
      fetchAllDatPhong()
      loadBookingPayments()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật trạng thái: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa đặt phòng này?")) return

    try {
      await removeDatPhong(id)
      toast({
        title: "Thành công",
        description: "Đã xóa đặt phòng"
      })
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể xóa: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  // Lọc và tìm kiếm
  const filteredBookings = datPhongList.filter(booking => {
    const matchesStatus = filterTrangThai === "all" || booking.trangThai === filterTrangThai
    
    const matchesSearch = !searchTerm || 
      rooms.find(r => r.idPhong === booking.idPhong)?.tenPhong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers.find(c => c.idKh === booking.idKh)?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(booking.idDatPhong).includes(searchTerm)
    
    return matchesStatus && matchesSearch
  })

  const getRoomName = (idPhong: number) => {
    return rooms.find(r => r.idPhong === idPhong)?.tenPhong || `Phòng #${idPhong}`
  }

  const getCustomerName = (idKh: number) => {
    return customers.find(c => c.idKh === idKh)?.hoTen || `Khách #${idKh}`
  }
  const getCustomerEmail = (idKh: number) => {
    return customers.find(c => c.idKh === idKh)?.email || '-'
  }
  const getCustomerCCCD = (idKh: number) => {
    return customers.find(c => c.idKh === idKh)?.cccd || '-'
  }

  const getProductName = (idSp: number) => {
    return products.find(p => p.idSp === idSp)?.tenSp || `Sản phẩm #${idSp}`
  }

  const getProductPrice = (idSp: number) => {
    return products.find(p => p.idSp === idSp)?.donGia || 0
  }

  const getBookingProducts = (idDatPhong: number) => {
    return bookingProducts.get(idDatPhong) || []
  }

  const getTotalProductValue = (idDatPhong: number) => {
    const products = getBookingProducts(idDatPhong)
    return products.reduce((total, item) => {
      const price = getProductPrice(item.idSp)
      return total + (price * item.soLuong)
    }, 0)
  }

  const getBookingPayments = (idDatPhong: number) => {
    return bookingPayments.get(idDatPhong) || []
  }

  const getPaymentStatus = (idDatPhong: number) => {
    const payments = getBookingPayments(idDatPhong)
    if (payments.length === 0) return "Chưa thanh toán"
    
    const latestPayment = payments[payments.length - 1]
    return latestPayment.trangThai || "Chưa xác định"
  }

  const canUpdateStatus = (booking: any) => {
    const bookingStatus = booking.trangThai || "Chờ xử lý"
    
    // Chỉ cho phép cập nhật khi trạng thái là "Chờ xử lý"
    // Không cho phép thay đổi sau khi đã "Đã xác nhận" hoặc "Đã hủy"
    return bookingStatus === "Chờ xử lý"
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "Chờ xử lý": "outline",
      "Đã xác nhận": "default",
      "Đã thanh toán": "secondary",
      "Đã hủy": "destructive"
    }
    
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-600">
                <h3 className="text-lg font-semibold mb-2">❌ Lỗi tải dữ liệu đặt phòng</h3>
                <p className="mb-4">{error}</p>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}</p>
                <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                <p><strong>Dữ liệu hiện tại:</strong> {datPhongList.length} đặt phòng</p>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button onClick={clearError}>Thử lại</Button>
                <Button onClick={() => router.push('/test-booking-api')} variant="outline">
                  Test API
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quản lý Đặt Phòng</CardTitle>
              <CardDescription>Tra cứu, lọc và cập nhật trạng thái đơn đặt phòng</CardDescription>
            </div>
            <Button onClick={() => router.push('/admin/bookings/add')}>
              + Thêm đặt phòng
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input
                id="search"
                placeholder="Tìm theo tên phòng, khách hàng hoặc mã đặt phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Lọc theo trạng thái</Label>
              <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                  <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                  <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                  <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Đặt Phòng</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>CCCD</TableHead>
                  <TableHead>Ngày Đặt</TableHead>
                  <TableHead>Ngày Trả</TableHead>
                  <TableHead>Sản Phẩm</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Thanh Toán</TableHead>
                  <TableHead className="text-right pr-4">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.idDatPhong}>
                    <TableCell className="font-medium">
                      #{booking.idDatPhong}
                    </TableCell>
                    <TableCell>{getRoomName(booking.idPhong)}</TableCell>
                    <TableCell>{getCustomerName(booking.idKh)}</TableCell>
                    <TableCell>{getCustomerEmail(booking.idKh)}</TableCell>
                    <TableCell>{getCustomerCCCD(booking.idKh)}</TableCell>
                    <TableCell>
                      {booking.ngayDat ? format(new Date(booking.ngayDat), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {booking.ngayTra ? format(new Date(booking.ngayTra), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const products = getBookingProducts(booking.idDatPhong!)
                        if (products.length === 0) {
                          return <span className="text-gray-500">Không có</span>
                        }
                        return (
                          <div className="space-y-1">
                            {products.map((item, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{getProductName(item.idSp)}</span>
                                <span className="text-gray-500"> x{item.soLuong}</span>
                                <span className="text-gray-400"> ({getProductPrice(item.idSp).toLocaleString('vi-VN')}đ)</span>
                              </div>
                            ))}
                            <div className="text-xs text-blue-600 font-medium">
                              Tổng: {getTotalProductValue(booking.idDatPhong!).toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.trangThai || 'Chờ xử lý')}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{getPaymentStatus(booking.idDatPhong!)}</div>
                        {(() => {
                          const payments = getBookingPayments(booking.idDatPhong!)
                          if (payments.length > 0) {
                            const latestPayment = payments[payments.length - 1]
                            return (
                              <div className="text-xs text-gray-500">
                                Mã: {latestPayment.idTt} | 
                                {latestPayment.soTien ? ` ${latestPayment.soTien.toLocaleString('vi-VN')}đ` : ''}
                              </div>
                            )
                          }
                          return null
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex gap-2 justify-end">
                        <Select
                          value={booking.trangThai || "Chờ xử lý"}
                          onValueChange={(value) => handleUpdateStatus(booking.idDatPhong!, value)}
                          disabled={!canUpdateStatus(booking)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const currentStatus = booking.trangThai || "Chờ xử lý"
                              
                              // Nếu đang ở trạng thái "Chờ xử lý", cho phép chọn "Đã xác nhận" hoặc "Đã hủy"
                              if (currentStatus === "Chờ xử lý") {
                                return (
                                  <>
                                    <SelectItem value="Chờ xử lý" disabled>Chờ xử lý</SelectItem>
                                    <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                                    <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                                  </>
                                )
                              }
                              
                              // Nếu đã xác nhận hoặc đã hủy, chỉ hiển thị trạng thái hiện tại
                              return (
                                <SelectItem value={currentStatus} disabled>
                                  {currentStatus}
                                </SelectItem>
                              )
                            })()}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(booking.idDatPhong!)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {filteredBookings.length === 0 && !loading && (
            <div className="text-center py-8 space-y-4">
              <div className="text-gray-500">
                {searchTerm || filterTrangThai !== "all" ? "Không tìm thấy đặt phòng nào" : "Chưa có đặt phòng nào"}
              </div>
              
              {datPhongList.length === 0 && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Debug Info:</strong></p>
                  <p>• Tổng đặt phòng: {datPhongList.length}</p>
                  <p>• Phòng: {rooms.length}</p>
                  <p>• Khách hàng: {customers.length}</p>
                  <p>• API Base: {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}</p>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => router.push('/test-booking-api')} 
                      variant="outline" 
                      size="sm"
                    >
                      Test API Connection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <DebugInfo 
        title="Booking Data Debug"
        data={{
          bookings: datPhongList,
          rooms: rooms,
          customers: customers,
          products: products
        }}
        onRefresh={() => {
          fetchAllDatPhong()
          loadReferences()
        }}
        loading={loading}
      />
    </div>
  )
}
