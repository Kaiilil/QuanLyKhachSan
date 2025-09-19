"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSession } from "@/hooks/use-session"
import { createDatPhong, findDatPhongByPhong, type DatPhongDTO } from "@/lib/datphong-api"
import { getPhongDetailById, type PhongDetailDTO } from "@/lib/phong-api"
import { getRoomTypeById } from "@/lib/db"
import type { RoomType } from "@/lib/types"
import { formatCurrencyVND } from "@/lib/format"
import { createKhachHang } from "@/lib/khachhang-api"
import { createThanhToan } from "@/lib/thanhtoan-api"
import { updatePhong } from "@/lib/phong-api"
import { toast } from "@/hooks/use-toast"
import { 
  Calendar, 
  Users, 
  Square, 
  Eye, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Wifi,
  Star
} from "lucide-react"

type BookingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: number | null
}

interface CustomerFormData {
  hoTen: string
  cccd: string
  soDienThoai: string
  email: string
  diaChi: string
}

function toDateOnly(d: string): string {
  return d?.slice(0, 10) || ""
}

function isOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  if (!aStart || !aEnd || !bStart || !bEnd) return false
  const aS = new Date(aStart).getTime()
  const aE = new Date(aEnd).getTime()
  const bS = new Date(bStart).getTime()
  const bE = new Date(bEnd).getTime()
  if (Number.isNaN(aS) || Number.isNaN(aE) || Number.isNaN(bS) || Number.isNaN(bE)) return false
  return aS < bE && bS < aE
}

export default function BookingModal({ open, onOpenChange, roomId }: BookingModalProps) {
  const { user, ready } = useSession()
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<string>("")
  const [checkOut, setCheckOut] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [existing, setExisting] = useState<DatPhongDTO[]>([])
  const [error, setError] = useState<string | null>(null)
  const [roomDetail, setRoomDetail] = useState<PhongDetailDTO | null>(null)
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const [customerData, setCustomerData] = useState<CustomerFormData>({
    hoTen: "",
    cccd: "",
    soDienThoai: "",
    email: "",
    diaChi: ""
  })

  // Tự động điền thông tin khách từ tài khoản đang đăng nhập (chỉ khi các trường đang trống)
  useEffect(() => {
    if (!user || !open) return
    setCustomerData(prev => ({
      ...prev,
      hoTen: prev.hoTen || user.fullName || user.username || "",
      soDienThoai: prev.soDienThoai || user.phone || "",
      email: prev.email || user.email || "",
      diaChi: prev.diaChi || user.address || ""
    }))
  }, [user, open])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setCheckIn("")
      setCheckOut("")
      setError(null)
      setErrors({})
      setCustomerData({
        hoTen: "",
        cccd: "",
        soDienThoai: "",
        email: "",
        diaChi: ""
      })
    }
  }, [open])

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!open || !roomId) return
      setLoading(true)
      setError(null)
      try {
        // Lấy thông tin phòng trước
        const detail = await getPhongDetailById(roomId)
        if (!mounted) return
        setRoomDetail(detail)
        
        // Lấy thông tin loại phòng
        if (detail.idLoaiPhong) {
          try {
            const rt = await getRoomTypeById(String(detail.idLoaiPhong))
            if (mounted && rt) {
              setRoomType(rt)
            } else if (mounted) {
              console.warn("Không nhận được dữ liệu loại phòng cho ID:", detail.idLoaiPhong)
              setRoomType(null)
            }
          } catch (rtError) {
            console.warn("Không thể lấy thông tin loại phòng:", rtError)
            if (mounted) setRoomType(null)
          }
        }
        
        // Lấy danh sách đặt phòng (có thể trống nếu API không tồn tại)
        try {
          const bookings = await findDatPhongByPhong(roomId)
          if (mounted) {
            setExisting(bookings.map(i => ({ 
              ...i, 
              ngayDat: toDateOnly(i.ngayDat), 
              ngayTra: toDateOnly(i.ngayTra) 
            })))
          }
        } catch (bookingsError) {
          console.warn("Không thể lấy danh sách đặt phòng:", bookingsError)
          // Set existing thành mảng rỗng nếu không lấy được
          if (mounted) setExisting([])
        }
        
      } catch (e: any) {
        if (!mounted) return
        console.warn("Error loading room details:", e)
        setExisting([])
        setError(e?.message || "Không tải được thông tin phòng")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [open, roomId])

  const hasConflict = useMemo(() => {
    if (!checkIn || !checkOut) return false
    return existing.some(b => isOverlap(b.ngayDat, b.ngayTra, checkIn, checkOut))
  }, [existing, checkIn, checkOut])

  const numberOfDays = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [checkIn, checkOut])

  const totalPrice = useMemo(() => {
    if (!roomType || numberOfDays <= 0) return 0
    return roomType.price * numberOfDays
  }, [roomType, numberOfDays])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!customerData.hoTen.trim()) {
      newErrors.hoTen = "Họ và tên là bắt buộc"
    } else if (customerData.hoTen.trim().length < 2) {
      newErrors.hoTen = "Họ và tên phải có ít nhất 2 ký tự"
    }

    if (!customerData.cccd.trim()) {
      newErrors.cccd = "CCCD/CMND là bắt buộc"
    } else if (!/^\d{9,12}$/.test(customerData.cccd.trim())) {
      newErrors.cccd = "CCCD/CMND phải có 9-12 số"
    }

    if (!customerData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại là bắt buộc"
    } else if (!/^[0-9]{10,11}$/.test(customerData.soDienThoai.trim())) {
      newErrors.soDienThoai = "Số điện thoại phải có 10-11 số"
    }

    if (!customerData.email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!checkIn) {
      newErrors.ngayDat = "Ngày đặt phòng là bắt buộc"
    }

    if (!checkOut) {
      newErrors.ngayTra = "Ngày trả phòng là bắt buộc"
    }

    if (checkIn && checkOut) {
      const ngayDat = new Date(checkIn)
      const ngayTra = new Date(checkOut)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (ngayDat < today) {
        newErrors.ngayDat = "Ngày đặt phòng không thể trong quá khứ"
      }

      if (ngayTra <= ngayDat) {
        newErrors.ngayTra = "Ngày trả phòng phải sau ngày đặt phòng"
      }

      if (hasConflict) {
        newErrors.ngayDat = "Khoảng thời gian này trùng với lịch đặt phòng hiện tại"
        newErrors.ngayTra = "Khoảng thời gian này trùng với lịch đặt phòng hiện tại"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleDateChange = (field: 'checkIn' | 'checkOut', value: string) => {
    if (field === 'checkIn') {
      setCheckIn(value)
      // Auto-set checkout to next day if not set
      if (!checkOut && value) {
        const nextDay = new Date(value)
        nextDay.setDate(nextDay.getDate() + 1)
        setCheckOut(nextDay.toISOString().split('T')[0])
      }
    } else {
      setCheckOut(value)
    }
    
    // Clear date errors when user changes dates
    if (errors.ngayDat) setErrors(prev => ({ ...prev, ngayDat: "" }))
    if (errors.ngayTra) setErrors(prev => ({ ...prev, ngayTra: "" }))
  }

  async function handleSubmit() {
    if (!roomId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin phòng",
        variant: "destructive"
      })
      return
    }
    
    if (!ready) {
      toast({
        title: "Lỗi",
        description: "Đang kiểm tra phiên đăng nhập...",
        variant: "destructive"
      })
      return
    }
    
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để đặt phòng",
        variant: "destructive"
      })
      return
    }
    
    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)
      
      // Tạo khách hàng
      let newCustomer
      try {
        newCustomer = await createKhachHang(customerData)
        if (!newCustomer || !newCustomer.idKh) {
          throw new Error("Không thể tạo thông tin khách hàng")
        }
      } catch (customerError: any) {
        console.warn("Lỗi tạo khách hàng:", customerError)
        throw new Error(`Lỗi tạo thông tin khách hàng: ${customerError.message || "Lỗi không xác định"}`)
      }
      
      // Tạo đặt phòng
      let newBooking
      try {
        newBooking = await createDatPhong({
          idPhong: roomId,
          idKh: newCustomer.idKh,
          ngayDat: checkIn,
          ngayTra: checkOut,
          trangThai: "Chờ xử lý",
        })
        if (!newBooking || !newBooking.idDatPhong) {
          throw new Error("Không thể tạo đặt phòng")
        }
      } catch (bookingError: any) {
        console.warn("Lỗi tạo đặt phòng:", bookingError)
        throw new Error(`Lỗi tạo đặt phòng: ${bookingError.message || "Lỗi không xác định"}`)
      }
      
      // Cập nhật trạng thái phòng
      try {
        await updatePhong(roomId, { trangThai: "Đang sử dụng" })
      } catch (updateError: any) {
        console.warn("Lỗi cập nhật trạng thái phòng:", updateError)
        // Không throw error vì đặt phòng đã thành công
      }
      
      if (newBooking.idDatPhong) {
        try {
          const thanhToan = await createThanhToan({
            idDatPhong: newBooking.idDatPhong,
            ngayDat: checkIn,
            ngayTra: checkOut,
            soTien: totalPrice,
            hinhThucTt: "payment",
            trangThai: "Chờ thanh toán"
          })
          
          toast({
            title: "🎉 Đặt phòng thành công!",
            description: `Phòng ${roomDetail?.tenPhong || 'đã chọn'} đã được đặt thành công.\nMã đặt phòng: ${newBooking.idDatPhong}\nMã thanh toán: ${thanhToan.idTt}\nTiền phòng: ${formatCurrencyVND(totalPrice)}\nNgày nhận phòng: ${new Date(checkIn).toLocaleDateString('vi-VN')}\nNgày trả phòng: ${new Date(checkOut).toLocaleDateString('vi-VN')}\n\nĐang chuyển đến trang thanh toán...`,
            duration: 8000
          })
        } catch (error: any) {
          console.warn("Lỗi tạo thanh toán:", error)
          toast({
            title: "⚠️ Đặt phòng thành công nhưng lỗi thanh toán",
            description: `Phòng ${roomDetail?.tenPhong || 'đã chọn'} đã được đặt thành công.\nMã đặt phòng: ${newBooking.idDatPhong}\nLỗi thanh toán: ${error.message}\n\nBạn vẫn có thể thanh toán sau tại trang checkout.`,
            duration: 8000
          })
        }
      }
      
      // Chỉ chuyển hướng khi có idDatPhong
      if (newBooking.idDatPhong) {
        onOpenChange(false)
        
        // Delay nhỏ để toast hiển thị đầy đủ trước khi chuyển hướng
        setTimeout(() => {
          router.push(`/checkout?datPhongId=${newBooking.idDatPhong}`)
        }, 1000)
      } else {
        onOpenChange(false)
        toast({
          title: "⚠️ Lỗi",
          description: "Đặt phòng thành công nhưng không thể chuyển đến trang thanh toán. Vui lòng liên hệ admin.",
          variant: "destructive"
        })
      }
    } catch (e: any) {
      setError(e?.message || "Đặt phòng thất bại")
      toast({
        title: "Lỗi",
        description: `Đặt phòng thất bại: ${e?.message || "Lỗi không xác định"}`,
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Don't render if session is not ready
  if (!ready) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="booking-modal-content max-w-7xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-center">
            🏨 Đặt Phòng Khách Sạn
          </DialogTitle>
          {roomDetail && (
            <div className="text-center mt-2">
              <p className="text-blue-100 text-base">
                Phòng: <span className="font-semibold">{roomDetail.tenPhong}</span>
                {roomType && <span> - <span className="font-semibold">{roomType.name}</span></span>}
              </p>
              {roomType && (
                <p className="text-blue-200 text-sm">
                  {formatCurrencyVND(roomType.price)}/đêm
                </p>
              )}
            </div>
          )}
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Đang tải thông tin phòng...</p>
            </div>
          </div>
        ) : roomDetail ? (
          <div className="modal-content-wrapper modal-scroll-container p-3 pb-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
              {/* Form đặt phòng - 2 cột */}
              <div className="xl:col-span-2 space-y-2">
                {/* Thông tin cá nhân */}
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                    <CardTitle className="flex items-center gap-3 text-xl text-green-800">
                      <Users className="w-6 h-6" />
                      Thông tin cá nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="hoTen" className="text-sm font-medium">Họ và tên *</Label>
                        <Input
                          id="hoTen"
                          value={customerData.hoTen}
                          onChange={(e) => handleInputChange('hoTen', e.target.value)}
                          placeholder="Nhập họ và tên"
                          className={`h-10 text-base ${errors.hoTen ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                        />
                        {errors.hoTen && <p className="text-red-500 text-sm">{errors.hoTen}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cccd" className="text-sm font-medium">CCCD/CMND *</Label>
                        <Input
                          id="cccd"
                          value={customerData.cccd}
                          onChange={(e) => handleInputChange('cccd', e.target.value)}
                          placeholder="Nhập số CCCD/CMND"
                          className={`h-10 text-base ${errors.cccd ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                        />
                        {errors.cccd && <p className="text-red-500 text-sm">{errors.cccd}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="soDienThoai" className="text-sm font-medium">Số điện thoại *</Label>
                        <Input
                          id="soDienThoai"
                          value={customerData.soDienThoai}
                          onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                          placeholder="Nhập số điện thoại"
                          className={`h-10 text-base ${errors.soDienThoai ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                        />
                        {errors.soDienThoai && <p className="text-red-500 text-sm">{errors.soDienThoai}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Nhập email"
                          className={`h-10 text-base ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="diaChi" className="text-sm font-medium">Địa chỉ</Label>
                        <Input
                          id="diaChi"
                          value={customerData.diaChi}
                          onChange={(e) => handleInputChange('diaChi', e.target.value)}
                          placeholder="Nhập địa chỉ (không bắt buộc)"
                          className="h-10 text-base focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Thông tin đặt phòng */}
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                    <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
                      <Calendar className="w-6 h-6" />
                      Thông tin đặt phòng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn" className="text-sm font-medium">Ngày nhận phòng *</Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={checkIn}
                          onChange={(e) => handleDateChange('checkIn', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className={`h-10 text-base ${errors.ngayDat ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                        />
                        {errors.ngayDat && <p className="text-red-500 text-sm">{errors.ngayDat}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut" className="text-sm font-medium">Ngày trả phòng *</Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={checkOut}
                          onChange={(e) => handleDateChange('checkOut', e.target.value)}
                          min={checkIn || new Date().toISOString().split('T')[0]}
                          className={`h-10 text-base ${errors.ngayTra ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                        />
                        {errors.ngayTra && <p className="text-red-500 text-sm">{errors.ngayTra}</p>}
                      </div>
                    </div>

                    {/* Conflict Warning */}
                    {hasConflict && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold">⚠️ Khoảng thời gian bị trùng</span>
                        </div>
                        <p className="text-sm text-red-600">
                          Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác.
                        </p>
                      </div>
                    )}

                    {/* Existing Bookings */}
                    {existing.length > 0 ? (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-700 mb-3">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-semibold">📅 Lịch đặt phòng hiện tại:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {existing.map((booking, index) => (
                            <div key={index} className="text-sm text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg border border-yellow-200">
                              📅 {new Date(booking.ngayDat).toLocaleDateString('vi-VN')} - {new Date(booking.ngayTra).toLocaleDateString('vi-VN')}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                          <Info className="w-5 h-5" />
                          <span className="font-semibold">ℹ️ Thông tin đặt phòng:</span>
                        </div>
                        <p className="text-sm text-blue-600">
                          Phòng này hiện chưa có lịch đặt phòng nào. Bạn có thể đặt phòng tự do.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="pt-2 pb-3 sticky bottom-0 bg-white/90 backdrop-blur-sm rounded-lg p-2 -mx-2">
                  <Button 
                    type="button"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg" 
                    disabled={submitting || hasConflict || !checkIn || !checkOut || !user}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Đang xử lý...
                      </div>
                    ) : !user ? (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Vui lòng đăng nhập
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Xác nhận đặt phòng
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {/* Bảng thông tin - 1 cột bên phải */}
              <div className="xl:col-span-1 space-y-2">
                {/* Thông tin phòng */}
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
                    <CardTitle className="flex items-center gap-3 text-xl text-purple-800">
                      <MapPin className="w-6 h-6" />
                      Thông tin phòng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="text-center mb-3">
                      <h3 className="font-bold text-2xl text-gray-900 mb-2">{roomDetail.tenPhong}</h3>
                      {roomType && <p className="text-lg text-muted-foreground">{roomType.name}</p>}
                    </div>
                    
                    {roomType && (
                      <>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-xs text-muted-foreground mb-1">Sức chứa</div>
                            <div className="font-bold text-lg">{roomType.capacity || 2}</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                            <Square className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <div className="text-xs text-muted-foreground mb-1">Diện tích</div>
                            <div className="font-bold text-lg">{roomType.sizeM2 || 20}m²</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                            <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <div className="text-xs text-muted-foreground mb-1">View</div>
                            <div className="font-bold text-lg">{roomType.view || "Biển"}</div>
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {formatCurrencyVND(roomType.price)}
                          </div>
                          <div className="text-sm text-muted-foreground">/đêm</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Tổng thanh toán */}
                {numberOfDays > 0 && roomType && (
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                      <CardTitle className="flex items-center gap-3 text-xl text-green-800">
                        <CheckCircle className="w-6 h-6" />
                        Tổng thanh toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-base">
                          <span className="text-muted-foreground">Giá phòng/đêm:</span>
                          <span className="font-medium">{formatCurrencyVND(roomType.price)}</span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span className="text-muted-foreground">Số đêm:</span>
                          <span className="font-medium">{numberOfDays} đêm</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-xl font-bold">
                          <span>Tổng cộng:</span>
                          <span className="text-blue-600">{formatCurrencyVND(totalPrice)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Thông tin bổ sung */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl text-green-800">
                      <Info className="w-6 h-6" />
                      Thông tin bổ sung
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-green-700">
                      <Shield className="w-5 h-5" />
                      <span>An toàn & Vệ sinh</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-green-700">
                      <Clock className="w-5 h-5" />
                      <span>Check-in: 14:00 | Check-out: 12:00</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-green-700">
                      <Wifi className="w-5 h-5" />
                      <span>WiFi miễn phí tốc độ cao</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-green-700">
                      <Star className="w-5 h-5" />
                      <span>Dịch vụ 5 sao</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                  <Card className="border-red-200 bg-red-50 shadow-lg">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 text-red-700 mb-2">
                        <XCircle className="w-5 h-5" />
                        <span className="font-semibold">Lỗi</span>
                      </div>
                      <p className="text-sm text-red-600">{error}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Không tìm thấy thông tin phòng</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}