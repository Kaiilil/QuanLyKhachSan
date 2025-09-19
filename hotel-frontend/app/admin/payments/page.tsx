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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { 
  getAllThanhToan, 
  getThanhToanByTrangThai, 
  getThanhToanCompleted, 
  getThanhToanPending, 
  type ThanhToanDTO 
} from "@/lib/thanhtoan-api"
import { getAllDatPhong, type DatPhongDTO } from "@/lib/datphong-api"
import { getAllPhong, type PhongDTO } from "@/lib/phong-api"
import { getAllKhachHang, type KhachHangDTO } from "@/lib/khachhang-api"
import { format } from "date-fns"

export default function AdminPaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<ThanhToanDTO[]>([])
  const [bookings, setBookings] = useState<DatPhongDTO[]>([])
  const [rooms, setRooms] = useState<PhongDTO[]>([])
  const [customers, setCustomers] = useState<KhachHangDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTrangThai, setFilterTrangThai] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchById, setSearchById] = useState<string>("")
  const [searchByPaymentId, setSearchByPaymentId] = useState<string>("")
  const [searchByEmail, setSearchByEmail] = useState<string>("")
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<ThanhToanDTO | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<DatPhongDTO | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<PhongDTO | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<KhachHangDTO | null>(null)

  useEffect(() => {
    loadData()
  }, [filterTrangThai])

  async function loadData() {
    try {
      setLoading(true)
      let paymentsData: ThanhToanDTO[] = []
      
      // Load payments based on filter
      if (filterTrangThai === "all") {
        paymentsData = await getAllThanhToan()
      } else if (filterTrangThai === "completed") {
        paymentsData = await getThanhToanCompleted()
      } else if (filterTrangThai === "pending") {
        paymentsData = await getThanhToanPending()
      } else {
        paymentsData = await getThanhToanByTrangThai(filterTrangThai)
      }

      // Load references
      const [bs, rs, cs] = await Promise.all([
        getAllDatPhong(),
        getAllPhong(),
        getAllKhachHang()
      ])

      setPayments(paymentsData)
      setBookings(bs)
      setRooms(rs)
      setCustomers(cs)
      // Tính doanh thu chỉ từ các khoản đã thanh toán
      setTotalAmount(
        paymentsData.reduce((sum, p) => isCompleted(p) ? sum + (p.soTien || 0) : sum, 0)
      )
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải dữ liệu: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  function isCompleted(p: ThanhToanDTO) {
    const status = (p.trangThai || "").trim().toLowerCase()
    return status === "hoàn thành" || status === "hoan thanh" || status === "đã thanh toán" || status === "da thanh toan"
  }



  const getBookingInfo = (idDatPhong?: number) => {
    if (!idDatPhong) return null
    return bookings.find(b => b.idDatPhong === idDatPhong)
  }

  const getRoomInfo = (idPhong?: number) => {
    if (!idPhong) return null
    return rooms.find(r => r.idPhong === idPhong)
  }

  const getCustomerInfo = (idKh?: number) => {
    if (!idKh) return null
    return customers.find(c => c.idKh === idKh)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Đã thanh toán":
        return <Badge className="bg-green-500">Đã thanh toán</Badge>
      case "Chờ thanh toán":
        return <Badge className="bg-yellow-500">Chờ thanh toán</Badge>
      case "Đang xử lý":
        return <Badge className="bg-blue-500">Đang xử lý</Badge>
      case "Đã hủy":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const openDetailModal = (payment: ThanhToanDTO) => {
    const booking = getBookingInfo(payment.idDatPhong)
    const room = booking ? getRoomInfo(booking.idPhong) : null
    const customer = booking ? getCustomerInfo(booking.idKh) : null
    
    setSelectedPayment(payment)
    setSelectedBooking(booking || null)
    setSelectedRoom(room || null)
    setSelectedCustomer(customer || null)
    setDetailModalOpen(true)
  }

  const filteredPayments = payments.filter(payment => {
    // Tìm kiếm theo mã thanh toán
    if (searchByPaymentId) {
      return payment.idTt?.toString().includes(searchByPaymentId)
    }
    
    // Tìm kiếm theo email khách hàng
    if (searchByEmail) {
      const booking = getBookingInfo(payment.idDatPhong)
      const customer = booking ? getCustomerInfo(booking.idKh) : null
      return customer?.email?.toLowerCase().includes(searchByEmail.toLowerCase())
    }
    
    // Tìm kiếm theo ID đơn đặt phòng
    if (searchById) {
      return payment.idDatPhong?.toString().includes(searchById)
    }
    
    // Tìm kiếm theo từ khóa chung
    if (searchTerm) {
      const booking = getBookingInfo(payment.idDatPhong)
      const room = booking ? getRoomInfo(booking.idPhong) : null
      const customer = booking ? getCustomerInfo(booking.idKh) : null
      
      return (
        room?.tenPhong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.soTien?.toString().includes(searchTerm)
      )
    }
    return true
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Thanh toán</h1>
          <p className="text-sm text-muted-foreground">Lọc, tìm kiếm và xem chi tiết các giao dịch thanh toán</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Tổng đơn đặt phòng</div>
            <div className="text-2xl font-bold text-blue-600">
              {bookings.length}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Tổng thanh toán</div>
            <div className="text-2xl font-bold text-green-600">
              {payments.length}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Tổng doanh thu</div>
            <div className="text-2xl font-bold text-green-600">
              {totalAmount.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>Tìm theo mã thanh toán, email khách, ID đặt phòng hoặc từ khóa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="searchByPaymentId">Tìm theo mã thanh toán</Label>
              <Input
                id="searchByPaymentId"
                placeholder="Nhập mã thanh toán..."
                value={searchByPaymentId}
                onChange={(e) => setSearchByPaymentId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="searchByEmail">Tìm theo email</Label>
              <Input
                id="searchByEmail"
                type="email"
                placeholder="Nhập email khách hàng..."
                value={searchByEmail}
                onChange={(e) => setSearchByEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="searchById">Tìm theo ID đơn đặt phòng</Label>
              <Input
                id="searchById"
                placeholder="Nhập ID đơn đặt phòng..."
                value={searchById}
                onChange={(e) => setSearchById(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="search">Tìm kiếm chung</Label>
              <Input
                id="search"
                placeholder="Tìm theo phòng, khách hàng, số tiền..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Đã thanh toán</SelectItem>
                  <SelectItem value="pending">Chờ thanh toán</SelectItem>
                  <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
                    {/* Clear Search Buttons */}
          <div className="flex gap-2 mt-4">
            {(searchByPaymentId || searchByEmail || searchById || searchTerm) && (
              <>
                {searchByPaymentId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchByPaymentId("")}
                  >
                    Xóa tìm kiếm mã TT
                  </Button>
                )}
                {searchByEmail && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchByEmail("")}
                  >
                    Xóa tìm kiếm email
                  </Button>
                )}
                {searchById && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchById("")}
                  >
                    Xóa tìm kiếm ID
                  </Button>
                )}
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchTerm("")}
                  >
                    Xóa tìm kiếm chung
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchByPaymentId("")
                    setSearchByEmail("")
                    setSearchById("")
                    setSearchTerm("")
                  }}
                >
                  Xóa tất cả
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách Thanh toán ({filteredPayments.length})
            {searchByPaymentId && (
              <span className="ml-2 text-sm text-blue-600">
                - Tìm theo mã thanh toán: {searchByPaymentId}
              </span>
            )}
            {searchByEmail && (
              <span className="ml-2 text-sm text-blue-600">
                - Tìm theo email: {searchByEmail}
              </span>
            )}
            {searchById && (
              <span className="ml-2 text-sm text-blue-600">
                - Tìm theo ID đơn đặt phòng: {searchById}
              </span>
            )}
          </CardTitle>
          <CardDescription>Danh sách giao dịch theo bộ lọc hiện tại</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Đang tải...
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã TT</TableHead>
                  <TableHead>Mã ĐP</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày TT</TableHead>
                  <TableHead>Ngày ĐP</TableHead>
                  <TableHead>Ngày Trả</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Hình thức</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const booking = getBookingInfo(payment.idDatPhong)
                  const room = booking ? getRoomInfo(booking.idPhong) : null
                  const customer = booking ? getCustomerInfo(booking.idKh) : null
                  
                  return (
                    <TableRow key={payment.idTt}>
                      <TableCell className="font-medium">{payment.idTt}</TableCell>
                      <TableCell>{payment.idDatPhong}</TableCell>
                      <TableCell>{room?.tenPhong || "N/A"}</TableCell>
                      <TableCell>{customer?.hoTen || "N/A"}</TableCell>
                      <TableCell>
                        {payment.ngayTt ? format(new Date(payment.ngayTt), 'dd/MM/yyyy') : "N/A"}
                      </TableCell>
                      <TableCell>
                        {payment.ngayDat ? format(new Date(payment.ngayDat), 'dd/MM/yyyy') : "N/A"}
                      </TableCell>
                      <TableCell>
                        {payment.ngayTra ? format(new Date(payment.ngayTra), 'dd/MM/yyyy') : "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.soTien?.toLocaleString('vi-VN')} VNĐ
                      </TableCell>
                      <TableCell>{payment.hinhThucTt || "payment"}</TableCell>
                      <TableCell>{getStatusBadge(payment.trangThai || "")}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailModal(payment)}
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground">
                      Không có thanh toán nào.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Chi tiết Thanh toán */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              📋 Chi tiết Thanh toán #{selectedPayment?.idTt}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPayment && selectedBooking && selectedRoom && selectedCustomer && (
            <div className="space-y-6">
              {/* Thông tin thanh toán */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    💳 Thông tin Thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Mã thanh toán</Label>
                      <p className="text-lg font-semibold">{selectedPayment.idTt}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                      <div>{getStatusBadge(selectedPayment.trangThai || "")}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Số tiền</Label>
                      <p className="text-xl font-bold text-green-600">
                        {selectedPayment.soTien?.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Hình thức thanh toán</Label>
                      <p className="text-lg">{selectedPayment.hinhThucTt || "payment"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Ngày thanh toán</Label>
                      <p className="text-lg">
                        {selectedPayment.ngayTt ? format(new Date(selectedPayment.ngayTt), 'dd/MM/yyyy HH:mm') : "Chưa thanh toán"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin đặt phòng */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    🏨 Thông tin Đặt phòng #{selectedBooking.idDatPhong}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Phòng</Label>
                      <p className="text-lg font-semibold">{selectedRoom.tenPhong}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Ngày nhận phòng</Label>
                      <p className="text-lg">
                        {selectedBooking.ngayDat ? format(new Date(selectedBooking.ngayDat), 'dd/MM/yyyy') : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Ngày trả phòng</Label>
                      <p className="text-lg">
                        {selectedBooking.ngayTra ? format(new Date(selectedBooking.ngayTra), 'dd/MM/yyyy') : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Trạng thái đặt phòng</Label>
                      <Badge variant="outline">{selectedBooking.trangThai || "N/A"}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin khách hàng */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    👤 Thông tin Khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Họ và tên</Label>
                      <p className="text-lg font-semibold">{selectedCustomer.hoTen}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-lg text-blue-600">
                        {selectedCustomer.email || "Không có email"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">CCCD/CMND</Label>
                      <p className="text-lg">{selectedCustomer.cccd}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
                      <p className="text-lg">{selectedCustomer.soDienThoai}</p>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Địa chỉ</Label>
                      <p className="text-lg">{selectedCustomer.diaChi || "Không có địa chỉ"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nút đóng */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setDetailModalOpen(false)}
                  className="px-8 py-2"
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
