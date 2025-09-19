"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { getAllDatPhong } from "@/lib/datphong-api"
import { getAllPhong } from "@/lib/phong-api"
import { getAllKhachHang } from "@/lib/khachhang-api"

export default function TestBookingAPIPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    bookings: any[]
    rooms: any[]
    customers: any[]
    errors: string[]
  }>({
    bookings: [],
    rooms: [],
    customers: [],
    errors: []
  })

  const testAPIs = async () => {
    setLoading(true)
    const errors: string[] = []
    let bookings: any[] = []
    let rooms: any[] = []
    let customers: any[] = []

    // Test API Base URL
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    console.log("API Base URL:", apiBase)

    // Test Bookings API
    try {
      console.log("Testing getAllDatPhong...")
      bookings = await getAllDatPhong()
      console.log("Bookings loaded:", bookings.length, "items")
    } catch (error: any) {
      const errorMsg = `Lỗi tải đặt phòng: ${error.message}`
      errors.push(errorMsg)
      console.error("Error loading bookings:", error)
    }

    // Test Rooms API
    try {
      console.log("Testing getAllPhong...")
      rooms = await getAllPhong()
      console.log("Rooms loaded:", rooms.length, "items")
    } catch (error: any) {
      const errorMsg = `Lỗi tải phòng: ${error.message}`
      errors.push(errorMsg)
      console.error("Error loading rooms:", error)
    }

    // Test Customers API
    try {
      console.log("Testing getAllKhachHang...")
      customers = await getAllKhachHang()
      console.log("Customers loaded:", customers.length, "items")
    } catch (error: any) {
      const errorMsg = `Lỗi tải khách hàng: ${error.message}`
      errors.push(errorMsg)
      console.error("Error loading customers:", error)
    }

    setResults({ bookings, rooms, customers, errors })
    setLoading(false)

    if (errors.length === 0) {
      toast({
        title: "Thành công",
        description: `Đã tải thành công: ${bookings.length} đặt phòng, ${rooms.length} phòng, ${customers.length} khách hàng`
      })
    } else {
      toast({
        title: "Có lỗi xảy ra",
        description: `Gặp ${errors.length} lỗi khi tải dữ liệu`,
        variant: "destructive"
      })
    }
  }

  const testDirectAPI = async () => {
    setLoading(true)
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    
    try {
      console.log("Testing direct API call to:", `${apiBase}/api/datphong`)
      const response = await fetch(`${apiBase}/api/datphong`, { 
        cache: "no-store",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log("Direct API response:", data)
      
      toast({
        title: "API Test thành công",
        description: `Nhận được ${Array.isArray(data) ? data.length : 'N/A'} items từ API`
      })
    } catch (error: any) {
      console.error("Direct API test failed:", error)
      toast({
        title: "API Test thất bại",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Test API Đặt Phòng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testAPIs} disabled={loading}>
              {loading ? "Đang test..." : "Test Tất Cả APIs"}
            </Button>
            <Button onClick={testDirectAPI} disabled={loading} variant="outline">
              {loading ? "Đang test..." : "Test API Trực Tiếp"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>
        </CardContent>
      </Card>

      {results.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">❌ Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Đặt Phòng
              <Badge variant="outline">{results.bookings.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.bookings.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.bookings.slice(0, 5).map((booking, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <div><strong>ID:</strong> {booking.idDatPhong}</div>
                    <div><strong>Phòng:</strong> {booking.idPhong}</div>
                    <div><strong>Khách:</strong> {booking.idKh}</div>
                    <div><strong>Ngày đặt:</strong> {booking.ngayDat}</div>
                    <div><strong>Trạng thái:</strong> {booking.trangThai || 'N/A'}</div>
                  </div>
                ))}
                {results.bookings.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    ... và {results.bookings.length - 5} đặt phòng khác
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có dữ liệu đặt phòng</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏨 Phòng
              <Badge variant="outline">{results.rooms.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.rooms.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.rooms.slice(0, 5).map((room, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <div><strong>ID:</strong> {room.idPhong}</div>
                    <div><strong>Tên:</strong> {room.tenPhong}</div>
                    <div><strong>Loại:</strong> {room.idLoaiPhong}</div>
                    <div><strong>Trạng thái:</strong> {room.trangThai || 'N/A'}</div>
                  </div>
                ))}
                {results.rooms.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    ... và {results.rooms.length - 5} phòng khác
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có dữ liệu phòng</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👥 Khách Hàng
              <Badge variant="outline">{results.customers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.customers.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.customers.slice(0, 5).map((customer, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <div><strong>ID:</strong> {customer.idKh}</div>
                    <div><strong>Tên:</strong> {customer.hoTen}</div>
                    <div><strong>Email:</strong> {customer.email}</div>
                    <div><strong>SĐT:</strong> {customer.soDienThoai}</div>
                  </div>
                ))}
                {results.customers.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    ... và {results.customers.length - 5} khách hàng khác
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có dữ liệu khách hàng</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📝 Hướng dẫn khắc phục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-800">1. Kiểm tra Backend Server</h4>
            <p className="text-blue-700 text-sm mt-1">
              Đảm bảo backend server đang chạy tại {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}
            </p>
          </div>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800">2. Kiểm tra Environment Variables</h4>
            <p className="text-yellow-700 text-sm mt-1">
              Tạo file .env.local với NEXT_PUBLIC_API_BASE_URL nếu cần thay đổi URL API
            </p>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800">3. Kiểm tra Console</h4>
            <p className="text-green-700 text-sm mt-1">
              Mở Developer Tools (F12) và xem tab Console để kiểm tra lỗi chi tiết
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
