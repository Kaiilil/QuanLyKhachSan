"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart, BookingsChart } from "@/components/admin/charts"
import { getAllUsers, countUsers } from "@/lib/users-api"
import { getAllPhong } from "@/lib/phong-api"
import { getAllDatPhong } from "@/lib/datphong-api"
import { getAllThanhToan } from "@/lib/thanhtoan-api"
import { getAllLoaiPhong } from "@/lib/loai-phong-api"
import { getAllKhachHang } from "@/lib/khachhang-api"
import { getAllThietBi } from "@/lib/thietbi-api"
import { getAllSanPham } from "@/lib/datphong-sanpham-api"
import { getAllPhongThietBi } from "@/lib/phongthietbi-api"
import { getAllDatPhongSanPham } from "@/lib/datphong-sanpham-api"
import { getCompanies, getUnits, getFloors } from "@/lib/admin-db"
import { formatCurrencyVND } from "@/lib/format"

// Function kiểm tra trạng thái backend
async function checkBackendHealth(): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    const response = await fetch(`${baseUrl}/api/users`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.ok
  } catch {
    return false
  }
}

function seriesLastNDays(n: number) {
  const dates: Date[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d)
  }
  return dates
}

function isCompleted(p: any) {
  const status = (p?.trangThai || "").toString().trim().toLowerCase()
  return status === "hoàn thành" || status === "hoan thanh" || status === "đã thanh toán" || status === "da thanh toan"
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [roomTypes, setRoomTypes] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [floors, setFloors] = useState<any[]>([])
  const [devices, setDevices] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [roomDevices, setRoomDevices] = useState<any[]>([])
  const [bookingProducts, setBookingProducts] = useState<any[]>([])
  const [guestPredictions, setGuestPredictions] = useState<any[]>([])
  const [roomHistory, setRoomHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setCurrentDate(new Date())
  }, [])
  
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load tất cả dữ liệu từ backend với error handling chi tiết
        console.log("Bắt đầu tải dữ liệu dashboard...")
        
        const us = await getAllUsers().catch((e) => {
          console.error("Lỗi tải users:", e)
          return []
        })
        console.log("Users loaded:", us.length)
        
        const rs = await getAllPhong().catch((e) => {
          console.error("Lỗi tải phòng:", e)
          return []
        })
        console.log("Phòng loaded:", rs.length)
        
        const bs = await getAllDatPhong().catch((e) => {
          console.error("Lỗi tải đặt phòng:", e)
          return []
        })
        console.log("Đặt phòng loaded:", bs.length)
        
        const ps = await getAllThanhToan().catch((e) => {
          console.error("Lỗi tải thanh toán:", e)
          return []
        })
        console.log("Thanh toán loaded:", ps.length)
        
        const rts = await getAllLoaiPhong().catch((e) => {
          console.error("Lỗi tải loại phòng:", e)
          return []
        })
        console.log("Loại phòng loaded:", rts.length)
        
        const cs = await getAllKhachHang().catch((e) => {
          console.error("Lỗi tải khách hàng:", e)
          return []
        })
        console.log("Khách hàng loaded:", cs.length)
        
        const devs = await getAllThietBi().catch((e) => {
          console.error("Lỗi tải thiết bị:", e)
          return []
        })
        console.log("Thiết bị loaded:", devs.length)
        
        const prods = await getAllSanPham().catch((e) => {
          console.error("Lỗi tải sản phẩm:", e)
          return []
        })
        console.log("Sản phẩm loaded:", prods.length)
        
        const rds = await getAllPhongThietBi().catch((e) => {
          console.error("Lỗi tải phòng thiết bị:", e)
          return []
        })
        console.log("Phòng thiết bị loaded:", rds.length)
        
        const bps = await getAllDatPhongSanPham().catch((e) => {
          console.error("Lỗi tải đặt phòng sản phẩm:", e)
          return []
        })
        console.log("Đặt phòng sản phẩm loaded:", bps.length)
        
        // Load thêm dữ liệu từ admin-db
        const comps = await getCompanies().catch((e) => {
          console.error("Lỗi tải công ty:", e)
          return []
        })
        console.log("Công ty loaded:", comps.length)
        
        const unts = await getUnits().catch((e) => {
          console.error("Lỗi tải đơn vị:", e)
          return []
        })
        console.log("Đơn vị loaded:", unts.length)
        
        const flrs = await getFloors().catch((e) => {
          console.error("Lỗi tải tầng:", e)
          return []
        })
        console.log("Tầng loaded:", flrs.length)
        
        // Tạm thời để trống các mục chưa có API
        const gps: any[] = [] // Dự đoán khách
        const rh: any[] = [] // Lịch sử phòng
        
        if (mounted) {
          setUsers(us)
          setRooms(rs)
          setBookings(bs)
          setPayments(ps)
          setRoomTypes(rts)
          setCustomers(cs)
          setCompanies(comps)
          setUnits(unts)
          setFloors(flrs)
          setDevices(devs)
          setProducts(prods)
          setRoomDevices(rds)
          setBookingProducts(bps)
          setGuestPredictions(gps)
          setRoomHistory(rh)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        if (mounted) {
          // Kiểm tra trạng thái backend
          const backendHealthy = await checkBackendHealth()
          let errorMessage = "Lỗi không xác định"
          
          if (error instanceof Error) {
            errorMessage = error.message
          }
          
          if (!backendHealthy) {
            errorMessage = "Backend server không phản hồi. Vui lòng kiểm tra server."
          }
          
          setError(`Không thể tải dữ liệu dashboard: ${errorMessage}`)
          setUsers([])
          setRooms([])
          setBookings([])
          setPayments([])
          setRoomTypes([])
          setCustomers([])
          setCompanies([])
          setUnits([])
          setFloors([])
          setDevices([])
          setProducts([])
          setRoomDevices([])
          setBookingProducts([])
          setGuestPredictions([])
          setRoomHistory([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const thisMonthBookings = useMemo(() => {
    if (!currentDate) return 0
    return bookings.filter((b) => {
      const d = new Date(b.ngayDat || b.createdAt || b.ngayTao)
      return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth()
    }).length
  }, [bookings, currentDate])

  const dailyRevenue = useMemo(() => {
    if (!mounted) return [] as { date: string; amount: number }[]
    return seriesLastNDays(30).map((d) => {
      const dateKey = d.toISOString().slice(0, 10)
      const amount = payments
        .filter((p) => {
          const paymentDate = p.ngayTt || p.paidAt || p.ngayThanhToan
          return paymentDate && paymentDate.slice(0, 10) === dateKey
        })
        .reduce((sum, p) => sum + (p.soTien || p.amount || 0), 0)
      return { date: dateKey, amount }
    })
  }, [mounted, payments])

  const dailyBookings = useMemo(() => {
    if (!mounted) return [] as { day: string; count: number }[]
    return seriesLastNDays(30).map((d) => {
      const dateKey = d.toISOString().slice(0, 10)
      const count = bookings.filter((b) => {
        const bookingDate = b.ngayDat || b.createdAt || b.ngayTao
        return bookingDate && bookingDate.slice(0, 10) === dateKey
      }).length
      return { day: dateKey, count }
    })
  }, [mounted, bookings])

  const totalRevenue = payments.filter(isCompleted).reduce((s, p) => s + (p.soTien || 0), 0)
  const totalUsers = users.length
  const totalRooms = rooms.length
  const totalRoomTypes = roomTypes.length
  const totalCustomers = customers.length
  const totalCompanies = companies.length
  const totalUnits = units.length
  const totalFloors = floors.length
  const totalDevices = devices.length
  const totalProducts = products.length
  const totalRoomDevices = roomDevices.length
  const totalBookingProducts = bookingProducts.length
  const totalGuestPredictions = guestPredictions.length
  const totalRoomHistory = roomHistory.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          Đang tải dữ liệu dashboard...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center max-w-2xl">
          <div className="text-red-500 text-lg font-semibold mb-2">Lỗi tải dữ liệu Dashboard</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <div className="text-sm text-gray-500 mb-4">
            Vui lòng kiểm tra:
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Backend server có đang chạy không?</li>
              <li>API endpoints có hoạt động không?</li>
              <li>Network connection có ổn định không?</li>
              <li>Console browser có hiển thị lỗi chi tiết không?</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="text-yellow-600">⚠️</div>
            <div className="text-yellow-800">
              <strong>Lưu ý:</strong> Một số dữ liệu có thể không tải được. Dashboard vẫn hiển thị thông tin có sẵn.
            </div>
          </div>
        </div>
      )}
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tổng khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalCustomers}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng số phòng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalRooms}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đơn đặt trong tháng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{thisMonthBookings}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu tổng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{formatCurrencyVND(totalRevenue)}</CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Loại phòng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalRoomTypes}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users hệ thống</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Công ty</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalCompanies}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đơn vị</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalUnits}</CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Tầng</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalFloors}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thiết bị</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalDevices}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalProducts}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dự đoán khách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuestPredictions}</div>
            <div className="text-sm text-gray-500">Chưa có dữ liệu</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <RevenueChart data={dailyRevenue} />
        <BookingsChart data={dailyBookings} />
      </div>

      

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-600">Phòng - Thiết bị</div>
                <div className="text-lg font-bold">{totalRoomDevices}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">Đặt phòng - Sản phẩm</div>
                <div className="text-lg font-bold">{totalBookingProducts}</div>
              </div>
         
              <div>
                <div className="font-semibold text-gray-600">Tổng thanh toán</div>
                <div className="text-lg font-bold">{payments.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
