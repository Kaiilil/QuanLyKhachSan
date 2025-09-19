"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getAllDatPhong, updateDatPhong, type DatPhongDTO } from "@/lib/datphong-api"
import { getAllPhong, type PhongDTO } from "@/lib/phong-api"
import { getAllKhachHang, type KhachHangDTO } from "@/lib/khachhang-api"
import { format } from "date-fns"

interface BookingListProps {
  title?: string
  showActions?: boolean
  maxItems?: number
  filterByStatus?: string
  filterByCustomer?: number
  filterByRoom?: number
}

export default function BookingList({
  title = "Danh sách Đặt Phòng",
  showActions = false,
  maxItems,
  filterByStatus,
  filterByCustomer,
  filterByRoom
}: BookingListProps) {
  const [bookings, setBookings] = useState<DatPhongDTO[]>([])
  const [rooms, setRooms] = useState<PhongDTO[]>([])
  const [customers, setCustomers] = useState<KhachHangDTO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [bs, rs, cs] = await Promise.all([
        getAllDatPhong(),
        getAllPhong(),
        getAllKhachHang()
      ])
      
      // Lọc dữ liệu theo các điều kiện
      let filteredBookings = bs
      
      if (filterByStatus) {
        filteredBookings = filteredBookings.filter(b => b.trangThai === filterByStatus)
      }
      
      if (filterByCustomer) {
        filteredBookings = filteredBookings.filter(b => b.idKh === filterByCustomer)
      }
      
      if (filterByRoom) {
        filteredBookings = filteredBookings.filter(b => b.idPhong === filterByRoom)
      }
      
      // Giới hạn số lượng nếu có
      if (maxItems) {
        filteredBookings = filteredBookings.slice(0, maxItems)
      }
      
      setBookings(filteredBookings)
      setRooms(rs)
      setCustomers(cs)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải danh sách đặt phòng: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(bookingId: number, newStatus: string) {
    try {
      await updateDatPhong(bookingId, { trangThai: newStatus })
      
      // Cập nhật local state
      setBookings(prev => 
        prev.map(b => b.idDatPhong === bookingId ? { ...b, trangThai: newStatus } : b)
      )
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái đặt phòng"
      })
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const getRoomName = (idPhong: number) => {
    return rooms.find(r => r.idPhong === idPhong)?.tenPhong || `Phòng #${idPhong}`
  }

  const getCustomerName = (idKh: number) => {
    return customers.find(c => c.idKh === idKh)?.hoTen || `Khách #${idKh}`
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

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Đang tải...</div>
        </CardContent>
      </Card>
    )
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Không có đặt phòng nào
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.idDatPhong}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-lg">
                      #{booking.idDatPhong}
                    </span>
                    {getStatusBadge(booking.trangThai || 'Chờ xử lý')}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Phòng:</span>
                      <span className="ml-2">{getRoomName(booking.idPhong)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Khách hàng:</span>
                      <span className="ml-2">{getCustomerName(booking.idKh)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ngày đặt:</span>
                      <span className="ml-2">
                        {booking.ngayDat ? format(new Date(booking.ngayDat), 'dd/MM/yyyy') : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ngày trả:</span>
                      <span className="ml-2">
                        {booking.ngayTra ? format(new Date(booking.ngayTra), 'dd/MM/yyyy') : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {showActions && (
                  <div className="ml-4">
                    <Select
                      value={booking.trangThai || "Chờ xử lý"}
                      onValueChange={(value) => handleStatusChange(booking.idDatPhong!, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                        <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                        <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                        <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {maxItems && bookings.length >= maxItems && (
          <div className="text-center mt-4">
            <Button variant="outline" onClick={loadData}>
              Xem thêm
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
