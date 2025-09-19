"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SiteHeader from "@/components/site-header"
import { getDatPhongById, type DatPhongDTO } from "@/lib/datphong-api"
import { getPhongById, type PhongDTO } from "@/lib/phong-api"
import { getKhachHangById, type KhachHangDTO } from "@/lib/khachhang-api"
import { getLoaiPhongById, type LoaiPhong } from "@/lib/loai-phong-api"
import { getThanhToanByDatPhong, type ThanhToanDTO } from "@/lib/thanhtoan-api"
import { getAllDatPhongSanPham, type DatPhongSanPhamDTO } from "@/lib/datphong-sanpham-api"
import { getAllSanPham, type SanPhamDTO } from "@/lib/datphong-sanpham-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle, CreditCard, Home, Calendar, User, Phone, Package } from "lucide-react"
import { format } from "date-fns"

export default function BookingSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const datPhongId = params.get("datPhongId")
  
  const [loading, setLoading] = useState(true)
  const [datPhong, setDatPhong] = useState<DatPhongDTO | null>(null)
  const [phong, setPhong] = useState<PhongDTO | null>(null)
  const [khachHang, setKhachHang] = useState<KhachHangDTO | null>(null)
  const [loaiPhong, setLoaiPhong] = useState<LoaiPhong | null>(null)
  const [thanhToan, setThanhToan] = useState<ThanhToanDTO | null>(null)
  const [sanPhamList, setSanPhamList] = useState<DatPhongSanPhamDTO[]>([])
  const [products, setProducts] = useState<SanPhamDTO[]>([])

  useEffect(() => {
    if (!datPhongId) {
      router.push("/")
      return
    }

    loadBookingData()
  }, [datPhongId])

  async function loadBookingData() {
    try {
      setLoading(true)
      
      // Lấy thông tin đặt phòng
      const datPhongData = await getDatPhongById(parseInt(datPhongId!))
      if (!datPhongData) {
        throw new Error("Không tìm thấy thông tin đặt phòng")
      }
      setDatPhong(datPhongData)
      
      // Lấy thông tin phòng
      const phongData = await getPhongById(datPhongData.idPhong!)
      setPhong(phongData)
      
      // Lấy thông tin khách hàng
      const khachHangData = await getKhachHangById(datPhongData.idKh!)
      setKhachHang(khachHangData)
      
      // Lấy thông tin loại phòng
      const loaiPhongData = await getLoaiPhongById(phongData.idLoaiPhong!)
      setLoaiPhong(loaiPhongData)
      
      // Lấy thông tin thanh toán
      const thanhToanList = await getThanhToanByDatPhong(parseInt(datPhongId!))
      if (thanhToanList.length > 0) {
        setThanhToan(thanhToanList[0])
      }
      
      // Lấy thông tin sản phẩm
      const [sanPhamData, productsData] = await Promise.all([
        getAllDatPhongSanPham(),
        getAllSanPham()
      ])
      
      // Lọc sản phẩm theo đặt phòng
      const sanPhamOfBooking = sanPhamData.filter(sp => sp.idDatPhong === parseInt(datPhongId!))
      setSanPhamList(sanPhamOfBooking)
      setProducts(productsData)
      
    } catch (error: any) {
      console.error("Error loading booking data:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = () => {
    router.push(`/checkout?datPhongId=${datPhongId}`)
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <main>
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Đang tải thông tin đặt phòng...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!datPhong || !phong || !khachHang || !loaiPhong || !thanhToan) {
    return (
      <main>
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <p className="text-center text-red-600">Không tìm thấy thông tin đặt phòng.</p>
        </div>
      </main>
    )
  }

  const nights = Math.max(
    1,
    Math.ceil((new Date(datPhong.ngayTra!).getTime() - new Date(datPhong.ngayDat!).getTime()) / (1000 * 60 * 60 * 24)),
  )

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header thành công */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt phòng thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã chọn chúng tôi. Dưới đây là thông tin chi tiết đặt phòng của bạn.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Thông tin đặt phòng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Thông tin đặt phòng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mã đặt phòng</Label>
                  <p className="font-semibold text-lg">{datPhong.idDatPhong}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mã thanh toán</Label>
                  <p className="font-semibold text-lg">{thanhToan.idTt}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phòng</Label>
                  <p className="font-semibold">{phong.tenPhong}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Loại phòng</Label>
                  <p className="font-semibold">{loaiPhong.tenLoaiPhong}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ngày nhận phòng</Label>
                  <p className="font-semibold">{format(new Date(datPhong.ngayDat!), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ngày trả phòng</Label>
                  <p className="font-semibold">{format(new Date(datPhong.ngayTra!), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Số đêm</Label>
                <p className="font-semibold text-lg">{nights} đêm</p>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin khách hàng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Họ tên</Label>
                <p className="font-semibold text-lg">{khachHang.hoTen}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {khachHang.soDienThoai}
                </p>
              </div>
              
              {khachHang.email && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-semibold">{khachHang.email}</p>
                </div>
              )}
              
              {khachHang.cccd && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">CCCD</Label>
                  <p className="font-semibold">{khachHang.cccd}</p>
                </div>
              )}
            </CardContent>
          </Card>
                 </div>

         {/* Thông tin sản phẩm */}
         {sanPhamList.length > 0 && (
           <Card className="mt-8">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Package className="w-5 h-5" />
                 Sản phẩm/Dịch vụ đã chọn
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-3">
                 {sanPhamList.map((sanPham, index) => {
                   const product = products.find(p => p.idSp === sanPham.idSp)
                   return (
                     <div key={index} className="flex justify-between items-center p-3 border rounded">
                       <div>
                         <p className="font-semibold">{product?.tenSp || `Sản phẩm #${sanPham.idSp}`}</p>
                         <p className="text-sm text-gray-600">Số lượng: {sanPham.soLuong}</p>
                       </div>
                       <div className="text-right">
                         <p className="font-semibold">{product?.donGia?.toLocaleString('vi-VN')} VNĐ</p>
                         <p className="text-sm text-gray-600">Tổng: {(product?.donGia || 0) * sanPham.soLuong} VNĐ</p>
                       </div>
                     </div>
                   )
                 })}
                 <div className="border-t pt-3 text-right">
                   <p className="font-semibold">
                     Tổng tiền sản phẩm: {sanPhamList.reduce((total, sp) => {
                       const product = products.find(p => p.idSp === sp.idSp)
                       return total + ((product?.donGia || 0) * sp.soLuong)
                     }, 0).toLocaleString('vi-VN')} VNĐ
                   </p>
                 </div>
               </div>
             </CardContent>
           </Card>
         )}

         {/* Thông tin thanh toán */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Thông tin thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tổng tiền</Label>
                <p className="text-3xl font-bold text-green-600">
                  {thanhToan.soTien?.toLocaleString('vi-VN')} VNĐ
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Trạng thái: <span className="font-medium text-yellow-600">Chờ thanh toán</span>
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Button>
                <Button 
                  onClick={handlePayment}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4" />
                  Thanh toán ngay
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lưu ý */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Vui lòng thanh toán trong vòng 24 giờ để giữ phòng</li>
                  <li>• Mang theo CCCD/CMND khi nhận phòng</li>
                  <li>• Giờ nhận phòng: 14:00, Giờ trả phòng: 12:00</li>
                  <li>• Liên hệ hotline nếu cần hỗ trợ</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
