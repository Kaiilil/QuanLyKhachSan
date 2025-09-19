"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createDatPhong, getAllDatPhong, type DatPhongCreateRequest, type DatPhongDTO } from "@/lib/datphong-api"
import { getAllPhong, type PhongDTO, updatePhong } from "@/lib/phong-api"
import { getAllLoaiPhong, type LoaiPhong } from "@/lib/loai-phong-api"
import { createKhachHang, searchKhachHang } from "@/lib/khachhang-api"
import { useSession } from "@/hooks/use-session"
import { createThanhToan } from "@/lib/thanhtoan-api"
import { getAllSanPham, type SanPhamDTO, createDatPhongSanPham } from "@/lib/datphong-sanpham-api"
import { format } from "date-fns"

interface CustomerFormData {
  hoTen: string
  cccd: string
  soDienThoai: string
  email: string
  diaChi: string
}

interface ProductOrder {
  idSp: number
  soLuong: number
}

export default function BookingPage() {
  const { user } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<PhongDTO[]>([])
  const [roomTypes, setRoomTypes] = useState<LoaiPhong[]>([])
  const [products, setProducts] = useState<SanPhamDTO[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [existingBookings, setExistingBookings] = useState<DatPhongDTO[]>([])
  const [roomBookingDates, setRoomBookingDates] = useState<{[roomId: number]: {ngayDat: string, ngayTra: string}[]}>({})
  
  // Lấy loại phòng từ URL params
  const selectedRoomTypeId = searchParams.get('roomTypeId') ? parseInt(searchParams.get('roomTypeId')!) : null
  
  // Form state
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    hoTen: "",
    cccd: "",
    soDienThoai: "",
    email: "",
    diaChi: ""
  })

  const [bookingData, setBookingData] = useState({
    idLoaiPhong: 0,
    idPhong: 0,
    ngayDat: "",
    ngayTra: "",
    trangThai: "Chờ xử lý"
  })

  // Cập nhật bookingData khi selectedRoomTypeId thay đổi
  useEffect(() => {
    if (selectedRoomTypeId) {
      setBookingData(prev => ({ ...prev, idLoaiPhong: selectedRoomTypeId }))
    }
  }, [selectedRoomTypeId])

  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    loadReferences()
  }, [])

  // Tự động điền thông tin khách từ tài khoản đang đăng nhập (chỉ khi các trường đang trống)
  useEffect(() => {
    if (!user) return
    setCustomerData(prev => ({
      ...prev,
      hoTen: prev.hoTen || user.fullName || user.username || "",
      soDienThoai: prev.soDienThoai || user.phone || "",
      email: prev.email || user.email || "",
      diaChi: prev.diaChi || user.address || ""
    }))
  }, [user])

  // Reset phòng đã chọn nếu không còn khả dụng
  useEffect(() => {
    if (bookingData.idPhong && rooms.length > 0) {
      const selectedRoom = rooms.find(r => r.idPhong === bookingData.idPhong)
      if (selectedRoom && selectedRoom.trangThai !== "Trống") {
        setBookingData(prev => ({ ...prev, idPhong: 0 }))
        toast({
          title: "Thông báo",
          description: `Phòng ${selectedRoom.tenPhong} không còn khả dụng (${selectedRoom.trangThai})`,
          variant: "destructive"
        })
      }
    }
  }, [rooms, bookingData.idPhong])

  async function loadReferences() {
    try {
      const [rs, rts, ps, bookings] = await Promise.all([
        getAllPhong(), 
        getAllLoaiPhong(), 
        getAllSanPham(),
        getAllDatPhong()
      ])
      setRooms(rs)
      setRoomTypes(rts)
      setProducts(ps)
      setExistingBookings(bookings)
      
      // Tạo map lịch đặt phòng cho từng phòng
      const roomDates: {[roomId: number]: {ngayDat: string, ngayTra: string}[]} = {}
      bookings.forEach(booking => {
        if (booking.idPhong && booking.ngayDat && booking.ngayTra) {
          if (!roomDates[booking.idPhong]) {
            roomDates[booking.idPhong] = []
          }
          roomDates[booking.idPhong].push({
            ngayDat: booking.ngayDat,
            ngayTra: booking.ngayTra
          })
        }
      })
      setRoomBookingDates(roomDates)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải dữ liệu: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  // Kiểm tra xem ngày có bị trùng với đặt phòng hiện tại không
  const isDateRangeOverlapping = (ngayDat: string, ngayTra: string, roomId: number): boolean => {
    const newStart = new Date(ngayDat)
    const newEnd = new Date(ngayTra)
    
    const existingDates = roomBookingDates[roomId] || []
    
    return existingDates.some(existing => {
      const existingStart = new Date(existing.ngayDat)
      const existingEnd = new Date(existing.ngayTra)
      
      // Cho phép đặt từ ngày trả trở đi (bao gồm cả ngày trả)
      // Chỉ trùng lịch khi: newStart < existingEnd VÀ newEnd > existingStart
      // Điều này có nghĩa là: ngày đặt mới < ngày trả cũ VÀ ngày trả mới > ngày đặt cũ
      const isOverlapping = (newStart < existingEnd && newEnd > existingStart)
      
      if (isOverlapping) {
        console.log(`Trùng lịch: ${ngayDat} - ${ngayTra} với ${existing.ngayDat} - ${existing.ngayTra}`)
      }
      
      return isOverlapping
    })
  }

  // Lọc phòng theo loại phòng và trạng thái thực tế
  const getAvailableRooms = () => {
    if (!bookingData.idLoaiPhong) return []
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const availableRooms = rooms.filter(room => {
      if (room.idLoaiPhong !== bookingData.idLoaiPhong) return false
      
      // Tìm booking hiện tại của phòng này
      const currentBooking = existingBookings.find(booking => 
        booking.idPhong === room.idPhong
      )
      
      if (!currentBooking) return true // Không có booking = trống
      
      // Kiểm tra xem phòng có đang được sử dụng không
      const ngayDat = new Date(currentBooking.ngayDat)
      const ngayTra = new Date(currentBooking.ngayTra)
      
      // Phòng trống nếu hôm nay < ngày đặt hoặc > ngày trả
      return today < ngayDat || today > ngayTra
    })
    
    // Debug: Log để kiểm tra
    console.log('All rooms:', rooms.map(r => ({ id: r.idPhong, name: r.tenPhong, status: r.trangThai, type: r.idLoaiPhong })))
    console.log('Available rooms:', availableRooms.map(r => ({ id: r.idPhong, name: r.tenPhong, status: r.trangThai })))
    
    return availableRooms
  }

  // Lấy danh sách ngày đã đặt cho một phòng cụ thể
  const getRoomBookingDates = (roomId: number) => {
    return roomBookingDates[roomId] || []
  }

  // Kiểm tra xem phòng có khả dụng trong khoảng thời gian đã chọn không
  const isRoomAvailableForDates = (roomId: number, ngayDat: string, ngayTra: string): boolean => {
    // Sử dụng function mới để đảm bảo logic nhất quán
    return canBookRoomForDates(roomId, ngayDat, ngayTra)
  }

  // Debug function để kiểm tra logic validation
  const debugDateValidation = (roomId: number, ngayDat: string, ngayTra: string) => {
    console.log(`=== DEBUG VALIDATION ===`)
    console.log(`Phòng: ${roomId}`)
    console.log(`Ngày đặt mới: ${ngayDat}`)
    console.log(`Ngày trả mới: ${ngayTra}`)
    
    const roomBookings = existingBookings.filter(booking => booking.idPhong === roomId)
    console.log(`Số booking hiện tại: ${roomBookings.length}`)
    
    roomBookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}: ${booking.ngayDat} - ${booking.ngayTra}`)
      
      const existingNgayDat = new Date(booking.ngayDat)
      const existingNgayTra = new Date(booking.ngayTra)
      const newNgayDat = new Date(ngayDat)
      const newNgayTra = new Date(ngayTra)
      
      const condition1 = newNgayDat < existingNgayTra
      const condition2 = newNgayTra > existingNgayDat
      
      console.log(`  Điều kiện 1 (ngày đặt mới < ngày trả cũ): ${condition1}`)
      console.log(`  Điều kiện 2 (ngày trả mới > ngày đặt cũ): ${condition2}`)
      console.log(`  Kết quả: ${condition1 && condition2 ? 'TRÙNG LỊCH' : 'KHÔNG TRÙNG'}`)
    })
    console.log(`=== END DEBUG ===`)
  }

  // Function test để kiểm tra logic ngày
  const testDateLogic = (ngayDat: string, ngayTra: string, existingNgayDat: string, existingNgayTra: string) => {
    console.log(`=== TEST DATE LOGIC ===`)
    
    // Parse dates với timezone cụ thể
    const newNgayDat = new Date(ngayDat + 'T00:00:00')
    const newNgayTra = new Date(ngayTra + 'T00:00:00')
    const existingNgayDatParsed = new Date(existingNgayDat + 'T00:00:00')
    const existingNgayTraParsed = new Date(existingNgayTra + 'T00:00:00')
    
    console.log(`Ngày đặt mới: ${ngayDat} → ${newNgayDat.toISOString()}`)
    console.log(`Ngày trả mới: ${ngayTra} → ${newNgayTra.toISOString()}`)
    console.log(`Ngày đặt cũ: ${existingNgayDat} → ${existingNgayDatParsed.toISOString()}`)
    console.log(`Ngày trả cũ: ${existingNgayTra} → ${existingNgayTraParsed.toISOString()}`)
    
    // So sánh trực tiếp
    const condition1 = newNgayDat < existingNgayTraParsed
    const condition2 = newNgayTra > existingNgayDatParsed
    
    console.log(`So sánh trực tiếp:`)
    console.log(`  ${newNgayDat.toISOString()} < ${existingNgayTraParsed.toISOString()}: ${condition1}`)
    console.log(`  ${newNgayTra.toISOString()} > ${existingNgayDatParsed.toISOString()}: ${condition2}`)
    
    // So sánh với getTime()
    const newNgayDatTime = newNgayDat.getTime()
    const newNgayTraTime = newNgayTra.getTime()
    const existingNgayDatTime = existingNgayDatParsed.getTime()
    const existingNgayTraTime = existingNgayTraParsed.getTime()
    
    const condition1Time = newNgayDatTime < existingNgayTraTime
    const condition2Time = newNgayTraTime > existingNgayDatTime
    
    console.log(`So sánh với getTime():`)
    console.log(`  ${newNgayDatTime} < ${existingNgayTraTime}: ${condition1Time}`)
    console.log(`  ${newNgayTraTime} > ${existingNgayDatTime}: ${condition2Time}`)
    
    const result = condition1Time && condition2Time
    console.log(`Kết quả cuối cùng: ${result ? 'TRÙNG LỊCH' : 'KHÔNG TRÙNG'}`)
    console.log(`=== END TEST ===`)
    
    return result
  }

  // Function kiểm tra xem phòng có thể đặt được không dựa trên ngày đã chọn
  const canBookRoomForDates = (roomId: number, ngayDat: string, ngayTra: string): boolean => {
    if (!ngayDat || !ngayTra) return true
    
    const roomBookings = existingBookings.filter(booking => booking.idPhong === roomId)
    
    for (const booking of roomBookings) {
      const existingNgayDat = new Date(booking.ngayDat)
      const existingNgayTra = new Date(booking.ngayTra)
      const newNgayDat = new Date(ngayDat)
      const newNgayTra = new Date(ngayTra)
      
      // Sử dụng function test để kiểm tra logic ngày
      const isOverlapping = testDateLogic(ngayDat, ngayTra, booking.ngayDat, booking.ngayTra)
      
      if (isOverlapping) {
        console.log(`❌ Phòng ${roomId} TRÙNG LỊCH`)
        return false
      }
    }
    
    console.log(`✅ Phòng ${roomId} KHÔNG TRÙNG LỊCH`)
    return true
  }

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Validate thông tin khách hàng
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

    if (customerData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    // Validate thông tin đặt phòng
    if (!bookingData.idLoaiPhong) {
      newErrors.idLoaiPhong = "Vui lòng chọn loại phòng"
    }

    if (!bookingData.idPhong) {
      newErrors.idPhong = "Vui lòng chọn phòng"
    } else {
      // Kiểm tra trạng thái thực tế của phòng đã chọn
      const selectedRoom = rooms.find(r => r.idPhong === bookingData.idPhong)
      if (selectedRoom) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
        // Tìm booking hiện tại của phòng này
        const currentBooking = existingBookings.find(booking => 
          booking.idPhong === selectedRoom.idPhong
        )
        
        if (currentBooking) {
          const ngayDat = new Date(currentBooking.ngayDat)
          const ngayTra = new Date(currentBooking.ngayTra)
          
          // Phòng không khả dụng nếu hôm nay >= ngày đặt và <= ngày trả
          if (today >= ngayDat && today <= ngayTra) {
            newErrors.idPhong = `Phòng ${selectedRoom.tenPhong} hiện tại đang được sử dụng từ ${format(ngayDat, 'dd/MM/yyyy')} đến ${format(ngayTra, 'dd/MM/yyyy')}`
            return false // Dừng validation ngay lập tức
          }
        }
      }
    }

    if (!bookingData.ngayDat) {
      newErrors.ngayDat = "Ngày đặt phòng là bắt buộc"
    }

    if (!bookingData.ngayTra) {
      newErrors.ngayTra = "Ngày trả phòng là bắt buộc"
    }

    // Kiểm tra ngày
    if (bookingData.ngayDat && bookingData.ngayTra) {
      const ngayDat = new Date(bookingData.ngayDat)
      const ngayTra = new Date(bookingData.ngayTra)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (ngayDat < today) {
        newErrors.ngayDat = "Ngày đặt phòng không thể trong quá khứ"
      }

      if (ngayTra <= ngayDat) {
        newErrors.ngayTra = "Ngày trả phòng phải sau ngày đặt phòng"
      }

      // Kiểm tra trùng lịch nếu đã chọn phòng
      if (bookingData.idPhong) {
        // Debug validation
        debugDateValidation(bookingData.idPhong, bookingData.ngayDat, bookingData.ngayTra)
        
        if (!isRoomAvailableForDates(bookingData.idPhong, bookingData.ngayDat, bookingData.ngayTra)) {
          newErrors.ngayDat = "Khoảng thời gian này trùng với lịch đặt phòng hiện tại"
          newErrors.ngayTra = "Khoảng thời gian này trùng với lịch đặt phòng hiện tại"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleBookingChange = (field: keyof typeof bookingData, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    
    // Kiểm tra trùng lịch real-time khi thay đổi ngày
    if ((field === 'ngayDat' || field === 'ngayTra') && bookingData.idPhong) {
      const newData = { ...bookingData, [field]: value }
      if (newData.ngayDat && newData.ngayTra) {
        // Debug validation real-time
        debugDateValidation(newData.idPhong, newData.ngayDat, newData.ngayTra)
        
        const isAvailable = isRoomAvailableForDates(newData.idPhong, newData.ngayDat, newData.ngayTra)
        if (!isAvailable) {
          setErrors(prev => ({
            ...prev,
            ngayDat: "Khoảng thời gian này trùng với lịch đặt phòng hiện tại",
            ngayTra: "Khoảng thời gian này trùng với lịch đặt phòng hiện tại"
          }))
        } else {
          // Clear date errors if dates are now valid
          setErrors(prev => ({
            ...prev,
            ngayDat: "",
            ngayTra: ""
          }))
        }
      }
    }
  }

  const addProduct = () => {
    if (products.length > 0) {
      setSelectedProducts(prev => [
        ...prev,
        { idSp: products[0].idSp, soLuong: 1 }
      ])
    }
  }

  const removeProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index))
  }

  const updateProduct = (index: number, field: keyof ProductOrder, value: any) => {
    setSelectedProducts(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const getProductName = (idSp: number) => {
    return products.find(p => p.idSp === idSp)?.tenSp || `Sản phẩm #${idSp}`
  }

  const getProductPrice = (idSp: number) => {
    return products.find(p => p.idSp === idSp)?.donGia || 0
  }

  const calculateProductTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const price = getProductPrice(item.idSp)
      return total + (price * item.soLuong)
    }, 0)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "destructive"
      })
      return
    }

    // Kiểm tra trạng thái phòng trước khi đặt
    const selectedRoom = rooms.find(r => r.idPhong === bookingData.idPhong)
    if (!selectedRoom) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin phòng",
        variant: "destructive"
      })
      return
    }

    // Kiểm tra trạng thái thực tế của phòng
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Tìm booking hiện tại của phòng này
    const currentBooking = existingBookings.find(booking => 
      booking.idPhong === selectedRoom.idPhong
    )
    
    if (currentBooking) {
      const ngayDat = new Date(currentBooking.ngayDat)
      const ngayTra = new Date(currentBooking.ngayTra)
      
      // Phòng không khả dụng nếu hôm nay >= ngày đặt và <= ngày trả
      if (today >= ngayDat && today <= ngayTra) {
        toast({
          title: "Lỗi",
          description: `Phòng ${selectedRoom.tenPhong} hiện tại đang được sử dụng từ ${format(ngayDat, 'dd/MM/yyyy')} đến ${format(ngayTra, 'dd/MM/yyyy')}`,
          variant: "destructive"
        })
        return
      }
    }

    setLoading(true)
    try {
      // Tạo/khớp khách hàng trước (ưu tiên dùng khách hàng đã tồn tại theo email/SDT/CCCD)
      const customerPayload = { ...customerData, email: customerData.email || user?.email || "" }
      const emailNorm = (customerPayload.email || "").trim().toLowerCase()
      const phoneNorm = (customerPayload.soDienThoai || "").replace(/[^\d]/g, "")
      const cccdNorm = (customerPayload.cccd || "").replace(/[^\d]/g, "")
      let customerId: number | undefined
      try {
        // 1) Ưu tiên tìm theo email
        if (!customerId && emailNorm) {
          const candidates = await searchKhachHang(emailNorm)
          const exact = candidates.find(k => (k.email || "").toLowerCase() === emailNorm)
          if (exact?.idKh) customerId = exact.idKh
        }
        // 2) Nếu chưa có, tìm theo số điện thoại
        if (!customerId && phoneNorm) {
          const candidates = await searchKhachHang(phoneNorm)
          const exact = candidates.find(k => (k.soDienThoai || "").replace(/[^\d]/g, "") === phoneNorm)
          if (exact?.idKh) customerId = exact.idKh
        }
        // 3) Nếu vẫn chưa, tìm theo CCCD
        if (!customerId && cccdNorm) {
          const candidates = await searchKhachHang(cccdNorm)
          const exact = candidates.find(k => (k.cccd || "").replace(/[^\d]/g, "") === cccdNorm)
          if (exact?.idKh) customerId = exact.idKh
        }
      } catch {}
      const newCustomer = customerId
        ? { idKh: customerId } as any
        : await createKhachHang(customerPayload)
      
      // Sau đó tạo đặt phòng
      const bookingRequest: DatPhongCreateRequest = {
        idPhong: bookingData.idPhong,
        idKh: (newCustomer as any).idKh!,
        ngayDat: bookingData.ngayDat,
        ngayTra: bookingData.ngayTra,
        trangThai: bookingData.trangThai
      }
      
      const newBooking = await createDatPhong(bookingRequest)
      
      // Tạo đặt phòng sản phẩm nếu có
      if (selectedProducts.length > 0 && newBooking.idDatPhong) {
        for (const product of selectedProducts) {
          await createDatPhongSanPham({
            idDatPhong: newBooking.idDatPhong!,
            idSp: product.idSp,
            soLuong: product.soLuong
          })
        }
      }
      
      // Cập nhật trạng thái phòng thành "Đang sử dụng"
      await updatePhong(bookingData.idPhong, { trangThai: "Đang sử dụng" })
      
      // Tính toán số tiền thanh toán (giá phòng * số ngày + sản phẩm)
      const ngayDat = new Date(bookingData.ngayDat)
      const ngayTra = new Date(bookingData.ngayTra)
      const soNgay = Math.ceil((ngayTra.getTime() - ngayDat.getTime()) / (1000 * 60 * 60 * 24))
      const giaPhong = selectedRoomType?.gia || 0
      const tongTienPhong = giaPhong * soNgay
      const tongTienSanPham = calculateProductTotal()
      const tongTien = tongTienPhong + tongTienSanPham
      
      // Tạo thanh toán
      if (newBooking.idDatPhong) {
        try {
          const thanhToan = await createThanhToan({
            idDatPhong: newBooking.idDatPhong,
            ngayDat: bookingData.ngayDat,
            ngayTra: bookingData.ngayTra,
            soTien: tongTien,
            hinhThucTt: "payment",
            trangThai: "Chờ thanh toán"
          })
          
          const productInfo = selectedProducts.length > 0 
            ? `\nSản phẩm: ${selectedProducts.map(p => `${getProductName(p.idSp)} (${p.soLuong})`).join(', ')}`
            : ''
          
          toast({
            title: "🎉 Đặt phòng thành công!",
            description: `Phòng ${selectedRoom?.tenPhong || 'đã chọn'} đã được đặt thành công.\nMã đặt phòng: ${newBooking.idDatPhong}\nMã thanh toán: ${thanhToan.idTt}\nTiền phòng: ${tongTienPhong.toLocaleString('vi-VN')} VNĐ\nTiền sản phẩm: ${tongTienSanPham.toLocaleString('vi-VN')} VNĐ\nTổng tiền: ${tongTien.toLocaleString('vi-VN')} VNĐ${productInfo}\nNgày nhận phòng: ${new Date(bookingData.ngayDat).toLocaleDateString('vi-VN')}\nNgày trả phòng: ${new Date(bookingData.ngayTra).toLocaleDateString('vi-VN')}\n\nBạn có thể thanh toán ngay hoặc thanh toán sau.`,
            duration: 8000
          })
          
          // Thông báo thành công đã được hiển thị ở trên
        } catch (error: any) {
          console.error("Lỗi tạo thanh toán:", error)
          toast({
            title: "⚠️ Đặt phòng thành công nhưng lỗi thanh toán",
            description: `Phòng ${selectedRoom?.tenPhong || 'đã chọn'} đã được đặt thành công.\nMã đặt phòng: ${newBooking.idDatPhong}\nLỗi thanh toán: ${error.message}`,
            duration: 8000
          })
        }
      }
      
      // Reset form
      setCustomerData({
        hoTen: "",
        cccd: "",
        soDienThoai: "",
        email: "",
        diaChi: ""
      })
      setBookingData({
        idLoaiPhong: selectedRoomTypeId || 0,
        idPhong: 0,
        ngayDat: "",
        ngayTra: "",
        trangThai: "Chờ xử lý"
      })
      setErrors({})
      
      // Reload danh sách phòng để cập nhật trạng thái
      await loadReferences()
      
      // Chuyển đến trang thành công ngay lập tức
      console.log('Chuyển đến trang thành công với ID:', newBooking.idDatPhong)
      
      // Thử chuyển trang với router.push
      try {
        router.push(`/booking-success?datPhongId=${newBooking.idDatPhong}`)
      } catch (routerError) {
        console.error('Lỗi router.push:', routerError)
        // Fallback: sử dụng window.location
        window.location.href = `/booking-success?datPhongId=${newBooking.idDatPhong}`
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Đặt phòng thất bại: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedRoomType = roomTypes.find(rt => rt.idLoaiPhong === bookingData.idLoaiPhong)
  const selectedRoom = rooms.find(r => r.idPhong === bookingData.idPhong)
  const availableRooms = getAvailableRooms()

  // Nếu không có loại phòng được chọn, hiển thị form chọn loại phòng
  if (!selectedRoomTypeId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto p-6 max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Chọn Loại Phòng</CardTitle>
            <p className="text-center text-gray-600">Vui lòng chọn loại phòng để tiếp tục đặt phòng</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roomType">Loại phòng *</Label>
                <Select 
                  value={bookingData.idLoaiPhong.toString()} 
                  onValueChange={(value) => {
                    const roomTypeId = parseInt(value)
                    setBookingData(prev => ({ ...prev, idLoaiPhong: roomTypeId, idPhong: 0 }))
                    // Cập nhật URL để có roomTypeId
                    router.push(`/booking?roomTypeId=${roomTypeId}`)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại phòng..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((roomType) => (
                      <SelectItem key={roomType.idLoaiPhong} value={roomType.idLoaiPhong.toString()}>
                        {roomType.tenLoaiPhong} - {roomType.gia?.toLocaleString('vi-VN')}đ/đêm
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                  className="mt-4"
                >
                  Về trang chủ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form đặt phòng - 2 cột */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl card-hover">
            <CardHeader>
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Đặt Phòng Khách Sạn</CardTitle>
              {selectedRoomType && (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    Loại phòng: {selectedRoomType.tenLoaiPhong} - {selectedRoomType.gia.toLocaleString('vi-VN')}đ/đêm
                  </p>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push("/rooms")}
                    className="text-xs"
                  >
                    Chọn loại phòng khác
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cá nhân */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
              
              <div>
                <Label htmlFor="hoTen">Họ và tên *</Label>
                <Input
                  id="hoTen"
                  value={customerData.hoTen}
                  onChange={(e) => handleInputChange('hoTen', e.target.value)}
                  placeholder="Nhập họ và tên"
                  className={errors.hoTen ? "border-red-500" : ""}
                />
                {errors.hoTen && <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>}
              </div>

              <div>
                <Label htmlFor="cccd">CCCD/CMND *</Label>
                <Input
                  id="cccd"
                  value={customerData.cccd}
                  onChange={(e) => handleInputChange('cccd', e.target.value)}
                  placeholder="Nhập số CCCD/CMND"
                  className={errors.cccd ? "border-red-500" : ""}
                />
                {errors.cccd && <p className="text-red-500 text-sm mt-1">{errors.cccd}</p>}
              </div>

              <div>
                <Label htmlFor="soDienThoai">Số điện thoại *</Label>
                <Input
                  id="soDienThoai"
                  value={customerData.soDienThoai}
                  onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={errors.soDienThoai ? "border-red-500" : ""}
                />
                {errors.soDienThoai && <p className="text-red-500 text-sm mt-1">{errors.soDienThoai}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Nhập email (không bắt buộc)"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="diaChi">Địa chỉ</Label>
                <Input
                  id="diaChi"
                  value={customerData.diaChi}
                  onChange={(e) => handleInputChange('diaChi', e.target.value)}
                  placeholder="Nhập địa chỉ (không bắt buộc)"
                />
              </div>
            </div>

            {/* Thông tin đặt phòng */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin đặt phòng</h3>
              
              {/* Tổng quan tình trạng phòng */}
              {selectedRoomType && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-semibold text-blue-800 mb-2">
                    📊 Tình trạng phòng loại: {selectedRoomType.tenLoaiPhong}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {/* Tổng số phòng */}
                    <div className="text-center p-2 bg-blue-100 rounded">
                      <div className="font-bold text-blue-700">
                        {rooms.filter(room => room.idLoaiPhong === selectedRoomType.idLoaiPhong).length}
                      </div>
                      <div className="text-blue-600">Tổng phòng</div>
                    </div>
                    
                    {/* Phòng trống */}
                    <div className="text-center p-2 bg-green-100 rounded">
                      <div className="font-bold text-green-700">
                        {(() => {
                          const now = new Date()
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                          
                          return rooms.filter(room => {
                            if (room.idLoaiPhong !== selectedRoomType.idLoaiPhong) return false
                            
                            // Tìm booking hiện tại của phòng này
                            const currentBooking = existingBookings.find(booking => 
                              booking.idPhong === room.idPhong
                            )
                            
                            if (!currentBooking) return true // Không có booking = trống
                            
                            // Kiểm tra xem phòng có đang được sử dụng không
                            const ngayDat = new Date(currentBooking.ngayDat)
                            const ngayTra = new Date(currentBooking.ngayTra)
                            
                            // Phòng trống nếu hôm nay < ngày đặt hoặc > ngày trả
                            return today < ngayDat || today > ngayTra
                          }).length
                        })()}
                      </div>
                      <div className="text-green-600">Phòng trống</div>
                    </div>
                    
                    {/* Phòng đang sử dụng */}
                    <div className="text-center p-2 bg-red-100 rounded">
                      <div className="font-bold text-red-700">
                        {(() => {
                          const now = new Date()
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                          
                          return rooms.filter(room => {
                            if (room.idLoaiPhong !== selectedRoomType.idLoaiPhong) return false
                            
                            // Tìm booking hiện tại của phòng này
                            const currentBooking = existingBookings.find(booking => 
                              booking.idPhong === room.idPhong
                            )
                            
                            if (!currentBooking) return false // Không có booking = không đang sử dụng
                            
                            // Kiểm tra xem phòng có đang được sử dụng không
                            const ngayDat = new Date(currentBooking.ngayDat)
                            const ngayTra = new Date(currentBooking.ngayTra)
                            
                            // Phòng đang sử dụng nếu hôm nay >= ngày đặt và <= ngày trả
                            return today >= ngayDat && today <= ngayTra
                          }).length
                        })()}
                      </div>
                      <div className="text-red-600">Đang sử dụng</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="room">Chọn Phòng *</Label>
                <Select
                  value={bookingData.idPhong ? String(bookingData.idPhong) : ""}
                  onValueChange={(value) => handleBookingChange('idPhong', parseInt(value))}
                >
                  <SelectTrigger className={errors.idPhong ? "border-red-500" : ""}>
                    <SelectValue placeholder="Chọn phòng..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      if (!selectedRoomType) {
                        return (
                          <SelectItem value="no-rooms" disabled>
                            Vui lòng chọn loại phòng trước
                          </SelectItem>
                        )
                      }
                      
                      // Lấy tất cả phòng của loại phòng đã chọn
                      const allRoomsOfType = rooms.filter(room => 
                        room.idLoaiPhong === selectedRoomType.idLoaiPhong
                      )
                      
                      if (allRoomsOfType.length === 0) {
                        return (
                          <SelectItem value="no-rooms" disabled>
                            Không có phòng nào cho loại phòng này
                          </SelectItem>
                        )
                      }
                      
                      return allRoomsOfType.map((room) => {
                        const now = new Date()
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                        
                        // Tìm booking hiện tại của phòng này
                        const currentBooking = existingBookings.find(booking => 
                          booking.idPhong === room.idPhong
                        )
                        
                        let status = "Trống"
                        let isDisabled = false
                        
                        if (currentBooking) {
                          const ngayDat = new Date(currentBooking.ngayDat)
                          const ngayTra = new Date(currentBooking.ngayTra)
                          
                          // Kiểm tra xem ngày đã chọn có trùng lịch không
                          if (bookingData.ngayDat && bookingData.ngayTra) {
                            // Sử dụng function mới để kiểm tra
                            if (canBookRoomForDates(room.idPhong, bookingData.ngayDat, bookingData.ngayTra)) {
                              status = "Trống"
                              isDisabled = false
                            } else {
                              status = "Trùng lịch"
                              isDisabled = true
                            }
                          } else {
                            // Nếu chưa chọn ngày, chỉ kiểm tra trạng thái hiện tại
                            if (today >= ngayDat && today <= ngayTra) {
                              status = "Đang sử dụng"
                              isDisabled = true
                            } else {
                              status = "Trống"
                              isDisabled = false
                            }
                          }
                        }
                        
                        return (
                          <SelectItem 
                            key={room.idPhong} 
                            value={String(room.idPhong)}
                            disabled={isDisabled}
                            className={isDisabled ? "text-gray-400 cursor-not-allowed" : ""}
                          >
                            {room.tenPhong} - {status}
                            {currentBooking && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({format(new Date(currentBooking.ngayDat), 'dd/MM')} - {format(new Date(currentBooking.ngayTra), 'dd/MM')})
                              </span>
                            )}
                            {isDisabled && status === "Trùng lịch" && (
                              <span className="text-xs text-red-500 ml-2">
                                [Trùng lịch với ngày đã chọn]
                              </span>
                            )}
                            {isDisabled && status === "Đang sử dụng" && (
                              <span className="text-xs text-orange-500 ml-2">
                                [Đang sử dụng hiện tại]
                              </span>
                            )}
                          </SelectItem>
                        )
                      })
                    })()}
                  </SelectContent>
                </Select>
                {errors.idPhong && <p className="text-red-500 text-sm mt-1">{errors.idPhong}</p>}
                {selectedRoom && (
                  <p className="text-sm text-gray-600 mt-1">
                    Phòng: {selectedRoom.tenPhong} | Trạng thái: {(() => {
                      const now = new Date()
                      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                      
                      // Tìm booking hiện tại của phòng này
                      const currentBooking = existingBookings.find(booking => 
                        booking.idPhong === selectedRoom.idPhong
                      )
                      
                      if (!currentBooking) return "Trống"
                      
                      // Kiểm tra xem phòng có đang được sử dụng không
                      const ngayDat = new Date(currentBooking.ngayDat)
                      const ngayTra = new Date(currentBooking.ngayTra)
                      
                      // Phòng đang sử dụng nếu hôm nay >= ngày đặt và <= ngày trả
                      if (today >= ngayDat && today <= ngayTra) {
                        return "Đang sử dụng"
                      } else {
                        return "Trống"
                      }
                    })()}
                  </p>
                )}
                
                {/* Hiển thị lịch đặt phòng của phòng đã chọn */}
                {selectedRoom && roomBookingDates[selectedRoom.idPhong!] && roomBookingDates[selectedRoom.idPhong!].length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm font-semibold text-yellow-800 mb-2">
                      ⚠️ Lịch đặt phòng hiện tại:
                    </div>
                    <div className="space-y-1">
                      {roomBookingDates[selectedRoom.idPhong!].map((booking, index) => (
                        <div key={index} className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                          📅 {format(new Date(booking.ngayDat), 'dd/MM/yyyy')} - {format(new Date(booking.ngayTra), 'dd/MM/yyyy')}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-yellow-600 mt-2">
                      💡 Bạn có thể đặt phòng từ ngày trả trở đi (bao gồm cả ngày trả)
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="ngayDat">Ngày Đặt Phòng *</Label>
                <Input
                  id="ngayDat"
                  type="date"
                  value={bookingData.ngayDat}
                  onChange={(e) => handleBookingChange('ngayDat', e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className={errors.ngayDat ? "border-red-500" : ""}
                />
                {errors.ngayDat && <p className="text-red-500 text-sm mt-1">{errors.ngayDat}</p>}
              </div>

              <div>
                <Label htmlFor="ngayTra">Ngày Trả Phòng *</Label>
                <Input
                  id="ngayTra"
                  type="date"
                  value={bookingData.ngayTra}
                  onChange={(e) => handleBookingChange('ngayTra', e.target.value)}
                  min={bookingData.ngayDat || format(new Date(), 'yyyy-MM-dd')}
                  className={errors.ngayTra ? "border-red-500" : ""}
                />
                {errors.ngayTra && <p className="text-red-500 text-sm mt-1">{errors.ngayTra}</p>}
              </div>
            </div>

            {/* Sản phẩm/Dịch vụ */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sản phẩm/Dịch vụ (Tùy chọn)</h3>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={addProduct}
                className="w-full"
              >
                + Thêm sản phẩm
              </Button>

              {selectedProducts.length > 0 && (
                <div className="space-y-3">
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 border rounded">
                      <div className="flex-1">
                        <Select 
                          value={product.idSp.toString()} 
                          onValueChange={(value) => updateProduct(index, 'idSp', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.idSp} value={p.idSp.toString()}>
                                {p.tenSp} - {p.donGia.toLocaleString('vi-VN')}đ
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          value={product.soLuong}
                          onChange={(e) => updateProduct(index, 'soLuong', parseInt(e.target.value))}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeProduct(index)}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}

                  <div className="text-right font-medium">
                    Tổng tiền sản phẩm: {calculateProductTotal().toLocaleString('vi-VN')}đ
                  </div>
                </div>
              )}
            </div>

            {/* Tổng tiền */}
            {selectedProducts.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {(() => {
                      const ngayDat = new Date(bookingData.ngayDat)
                      const ngayTra = new Date(bookingData.ngayTra)
                      const soNgay = Math.ceil((ngayTra.getTime() - ngayDat.getTime()) / (1000 * 60 * 60 * 24))
                      const giaPhong = selectedRoomType?.gia || 0
                      const tongTienPhong = giaPhong * soNgay
                      const tongTienSanPham = calculateProductTotal()
                      return (tongTienPhong + tongTienSanPham).toLocaleString('vi-VN')
                    })()} VNĐ
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  (Tiền phòng: {(() => {
                    const ngayDat = new Date(bookingData.ngayDat)
                    const ngayTra = new Date(bookingData.ngayTra)
                    const soNgay = Math.ceil((ngayTra.getTime() - ngayDat.getTime()) / (1000 * 60 * 60 * 24))
                    const giaPhong = selectedRoomType?.gia || 0
                    return (giaPhong * soNgay).toLocaleString('vi-VN')
                  })()} VNĐ + Tiền sản phẩm: {calculateProductTotal().toLocaleString('vi-VN')} VNĐ)
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full btn-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt Phòng"}
            </Button>
          </form>
        </CardContent>
      </Card>
        </div>

        {/* Bảng phòng đang sử dụng - 1 cột bên phải */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-xl card-hover">
            <CardHeader>
              <CardTitle className="text-lg">🏨 Phòng Đã Được Đặt</CardTitle>
              <p className="text-sm text-gray-600">Danh sách phòng đã được đặt - Bạn có thể đặt từ ngày trả trở đi</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(() => {
                  // Lọc booking chỉ của loại phòng đã chọn
                  const filteredBookings = selectedRoomType 
                    ? existingBookings.filter(booking => {
                        const room = rooms.find(r => r.idPhong === booking.idPhong)
                        return room && room.idLoaiPhong === selectedRoomType.idLoaiPhong
                      })
                    : existingBookings
                  
                  if (filteredBookings.length === 0) {
                    if (!selectedRoomType) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-2xl mb-2">🏠</div>
                          <div className="text-sm">Vui lòng chọn loại phòng để xem danh sách</div>
                        </div>
                      )
                    } else {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-2xl mb-2">🏠</div>
                          <div className="text-sm">Chưa có phòng loại {selectedRoomType.tenLoaiPhong} nào được đặt</div>
                        </div>
                      )
                    }
                  }
                  
                  return filteredBookings.map((booking, index) => {
                    const room = rooms.find(r => r.idPhong === booking.idPhong)
                    const roomType = roomTypes.find(rt => rt.idLoaiPhong === room?.idLoaiPhong)
                    return (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="mb-2">
                          <div className="font-semibold text-sm text-blue-700">
                            {room?.tenPhong || `Phòng #${booking.idPhong}`}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          <div>Loại: {roomType?.tenLoaiPhong || "N/A"}</div>
                          <div>Giá: {roomType?.gia?.toLocaleString('vi-VN') || "N/A"}đ/đêm</div>
                        </div>
                        
                        <div className="text-xs">
                          <div className="flex items-center gap-1 text-green-600 mb-1">
                            <span>📅 Đặt:</span>
                            <span className="font-medium">
                              {booking.ngayDat ? format(new Date(booking.ngayDat), 'dd/MM/yyyy') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-red-600">
                            <span>📅 Trả:</span>
                            <span className="font-medium">
                              {booking.ngayTra ? format(new Date(booking.ngayTra), 'dd/MM/yyyy') : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
              
              {/* Thống kê tổng quan */}
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-semibold text-gray-700 mb-2">📊 Thống kê:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-blue-100 rounded">
                    <div className="font-bold text-blue-700">
                      {(() => {
                        if (!selectedRoomType) return existingBookings.length
                        
                        // Chỉ đếm booking của loại phòng đã chọn
                        return existingBookings.filter(booking => {
                          const room = rooms.find(r => r.idPhong === booking.idPhong)
                          return room && room.idLoaiPhong === selectedRoomType.idLoaiPhong
                        }).length
                      })()}
                    </div>
                    <div className="text-blue-600">
                      {selectedRoomType ? `Đặt phòng ${selectedRoomType.tenLoaiPhong}` : 'Tổng đặt phòng'}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-green-100 rounded">
                    <div className="font-bold text-green-700">
                      {(() => {
                        if (!selectedRoomType) {
                          // Nếu chưa chọn loại phòng, đếm tất cả phòng trống
                          const now = new Date()
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                          
                          return rooms.filter(room => {
                            const currentBooking = existingBookings.find(booking => 
                              booking.idPhong === room.idPhong
                            )
                            
                            if (!currentBooking) return true
                            
                            const ngayDat = new Date(currentBooking.ngayDat)
                            const ngayTra = new Date(currentBooking.ngayTra)
                            
                            return today < ngayDat || today > ngayTra
                          }).length
                        } else {
                          // Nếu đã chọn loại phòng, chỉ đếm phòng trống của loại đó
                          const now = new Date()
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                          
                          return rooms.filter(room => {
                            if (room.idLoaiPhong !== selectedRoomType.idLoaiPhong) return false
                            
                            const currentBooking = existingBookings.find(booking => 
                              booking.idPhong === room.idPhong
                            )
                            
                            if (!currentBooking) return true
                            
                            const ngayDat = new Date(currentBooking.ngayDat)
                            const ngayTra = new Date(currentBooking.ngayTra)
                            
                            return today < ngayDat || today > ngayTra
                          }).length
                        }
                      })()}
                    </div>
                    <div className="text-green-600">
                      {selectedRoomType ? `Phòng ${selectedRoomType.tenLoaiPhong} trống` : 'Phòng trống'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
