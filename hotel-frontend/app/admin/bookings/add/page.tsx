"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getAllPhong, type PhongDTO } from "@/lib/phong-api"
import { getAllKhachHang, type KhachHangDTO, createKhachHang, searchKhachHang } from "@/lib/khachhang-api"
import { getAllSanPham, type SanPhamDTO, createDatPhongSanPham } from "@/lib/datphong-sanpham-api"
import { createDatPhong, getAllDatPhong, type DatPhongDTO } from "@/lib/datphong-api"
import { createThanhToan } from "@/lib/thanhtoan-api"

interface BookingFormData {
  idPhong: number | null
  ngayDat: string
  ngayTra: string
  trangThai: string
}

interface CustomerFormData {
  hoTen: string
  email: string
  soDienThoai: string
  cccd: string
  diaChi: string
}

interface ProductOrder {
  idSp: number
  soLuong: number
}

export default function AddBookingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<PhongDTO[]>([])
  const [customers, setCustomers] = useState<KhachHangDTO[]>([])
  const [products, setProducts] = useState<SanPhamDTO[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductOrder[]>([])
  const [existingBookings, setExistingBookings] = useState<DatPhongDTO[]>([])
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const [formData, setFormData] = useState<BookingFormData>({
    idPhong: null,
    ngayDat: "",
    ngayTra: "",
    trangThai: "Chờ xử lý"
  })
  const [customerForm, setCustomerForm] = useState<CustomerFormData>({ hoTen: "", email: "", soDienThoai: "", cccd: "", diaChi: "" })

  useEffect(() => {
    loadReferences()
  }, [])

  async function loadReferences() {
    try {
      const [rs, cs, ps, bookings] = await Promise.all([
        getAllPhong(),
        getAllKhachHang(),
        getAllSanPham(),
        getAllDatPhong()
      ])
      setRooms(rs)
      setCustomers(cs)
      setProducts(ps)
      setExistingBookings(bookings)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải dữ liệu: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  // Kiểm tra xem phòng có thể đặt được không dựa trên ngày đã chọn
  const canBookRoomForDates = (roomId: number, ngayDat: string, ngayTra: string): boolean => {
    if (!ngayDat || !ngayTra) return true
    
    const roomBookings = existingBookings.filter(booking => booking.idPhong === roomId)
    
    for (const booking of roomBookings) {
      const existingNgayDat = new Date(booking.ngayDat)
      const existingNgayTra = new Date(booking.ngayTra)
      const newNgayDat = new Date(ngayDat)
      const newNgayTra = new Date(ngayTra)
      
      // Kiểm tra trùng lịch: newStart < existingEnd VÀ newEnd > existingStart
      const isOverlapping = (newNgayDat < existingNgayTra && newNgayTra > existingNgayDat)
      
      if (isOverlapping) {
        return false
      }
    }
    
    return true
  }

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Validate thông tin cơ bản
    if (!formData.idPhong) {
      newErrors.idPhong = "Vui lòng chọn phòng"
    }
    // Validate thông tin khách hàng nhập tay
    const emailNorm = (customerForm.email || "").trim().toLowerCase()
    const phoneNorm = (customerForm.soDienThoai || "").replace(/[^\d]/g, "")
    const cccdNorm = (customerForm.cccd || "").replace(/[^\d]/g, "")
    if (!customerForm.hoTen.trim()) newErrors.hoTen = "Vui lòng nhập họ tên"
    if (!emailNorm) newErrors.email = "Vui lòng nhập email"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailNorm)) newErrors.email = "Email không hợp lệ"
    if (!phoneNorm) newErrors.soDienThoai = "Vui lòng nhập SĐT"
    else if (!( /^0\d{9}$/.test(phoneNorm) || /^84\d{9}$/.test(phoneNorm) )) newErrors.soDienThoai = "SĐT không hợp lệ"
    if (!cccdNorm) newErrors.cccd = "Vui lòng nhập CCCD"
    else if (!/^\d{12}$/.test(cccdNorm)) newErrors.cccd = "CCCD phải gồm 12 chữ số"
    if (!customerForm.diaChi.trim()) newErrors.diaChi = "Vui lòng nhập địa chỉ"
    if (!formData.ngayDat) {
      newErrors.ngayDat = "Vui lòng chọn ngày đặt phòng"
    }
    if (!formData.ngayTra) {
      newErrors.ngayTra = "Vui lòng chọn ngày trả phòng"
    }

    // Validate ngày
    if (formData.ngayDat && formData.ngayTra) {
      const ngayDat = new Date(formData.ngayDat)
      const ngayTra = new Date(formData.ngayTra)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (ngayDat < today) {
        newErrors.ngayDat = "Ngày đặt phòng không thể là ngày trong quá khứ"
      }
      if (ngayTra <= ngayDat) {
        newErrors.ngayTra = "Ngày trả phòng phải sau ngày đặt phòng"
      }

      // Kiểm tra trùng lịch nếu đã chọn phòng
      if (formData.idPhong) {
        if (!canBookRoomForDates(formData.idPhong, formData.ngayDat, formData.ngayTra)) {
          newErrors.ngayDat = "Khoảng thời gian này trùng với lịch đặt phòng hiện tại"
          newErrors.ngayTra = "Khoảng thời gian này trùng với lịch đặt phòng hiện tại"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    
    // Kiểm tra trùng lịch real-time khi thay đổi ngày hoặc phòng
    if ((field === 'ngayDat' || field === 'ngayTra' || field === 'idPhong') && 
        formData.ngayDat && formData.ngayTra && formData.idPhong) {
      const newData = { ...formData, [field]: value }
      if (newData.ngayDat && newData.ngayTra && newData.idPhong) {
        const isAvailable = canBookRoomForDates(newData.idPhong, newData.ngayDat, newData.ngayTra)
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

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const price = getProductPrice(item.idSp)
      return total + (price * item.soLuong)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra và sửa các lỗi trong form",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Tìm / tạo khách hàng dựa trên email/SĐT/CCCD
      const emailNorm = (customerForm.email || "").trim().toLowerCase()
      const phoneNorm = (customerForm.soDienThoai || "").replace(/[^\d]/g, "")
      const cccdNorm = (customerForm.cccd || "").replace(/[^\d]/g, "")
      let customerId: number | undefined
      try {
        if (!customerId && emailNorm) {
          const list = await searchKhachHang(emailNorm)
          const exact = list.find(k => (k.email || "").toLowerCase() === emailNorm)
          if (exact?.idKh) customerId = exact.idKh
        }
        if (!customerId && phoneNorm) {
          const list = await searchKhachHang(phoneNorm)
          const exact = list.find(k => (k.soDienThoai || "").replace(/[^\d]/g, "") === phoneNorm)
          if (exact?.idKh) customerId = exact.idKh
        }
        if (!customerId && cccdNorm) {
          const list = await searchKhachHang(cccdNorm)
          const exact = list.find(k => (k.cccd || "").replace(/[^\d]/g, "") === cccdNorm)
          if (exact?.idKh) customerId = exact.idKh
        }
      } catch {}
      if (!customerId) {
        const created = await createKhachHang({ hoTen: customerForm.hoTen.trim(), email: emailNorm, soDienThoai: phoneNorm, cccd: cccdNorm, diaChi: customerForm.diaChi.trim() })
        customerId = created.idKh!
      }

      // Tạo đặt phòng
      const booking = await createDatPhong({
        idPhong: formData.idPhong!,
        idKh: customerId!,
        ngayDat: formData.ngayDat,
        ngayTra: formData.ngayTra,
        trangThai: formData.trangThai
      })

      // Tạo đặt phòng sản phẩm nếu có
      if (selectedProducts.length > 0 && booking.idDatPhong) {
        for (const product of selectedProducts) {
          await createDatPhongSanPham({
            idDatPhong: booking.idDatPhong!,
            idSp: product.idSp,
            soLuong: product.soLuong
          })
        }
      }

      // Tính toán tổng tiền
      const ngayDat = new Date(formData.ngayDat)
      const ngayTra = new Date(formData.ngayTra)
      const soNgay = Math.ceil((ngayTra.getTime() - ngayDat.getTime()) / (1000 * 60 * 60 * 24))
      const giaPhong = 500000 // Giá mặc định, có thể lấy từ loại phòng
      const tongTienPhong = giaPhong * soNgay
      const tongTienSanPham = calculateTotal()
      const tongTien = tongTienPhong + tongTienSanPham

      // Tạo thanh toán
      if (booking.idDatPhong) {
        try {
          const thanhToan = await createThanhToan({
            idDatPhong: booking.idDatPhong,
            ngayDat: formData.ngayDat,
            ngayTra: formData.ngayTra,
            soTien: tongTien,
            hinhThucTt: "payment",
            trangThai: "Chờ thanh toán"
          })
          
          toast({
            title: "🎉 Đặt phòng thành công!",
            description: `Đã tạo đặt phòng mới thành công.\nMã đặt phòng: ${booking.idDatPhong}\nMã thanh toán: ${thanhToan.idTt}\nTổng tiền: ${tongTien.toLocaleString('vi-VN')} VNĐ\nPhòng: ${rooms.find(r => r.idPhong === formData.idPhong)?.tenPhong}\nKhách hàng: ${customerForm.hoTen}\nNgày nhận: ${new Date(formData.ngayDat).toLocaleDateString('vi-VN')}\nNgày trả: ${new Date(formData.ngayTra).toLocaleDateString('vi-VN')}`,
            duration: 8000
          })
        } catch (error: any) {
          console.error("Lỗi tạo thanh toán:", error)
          toast({
            title: "🎉 Đặt phòng thành công!",
            description: `Đã tạo đặt phòng mới thành công.\nMã đặt phòng: ${booking.idDatPhong}\n`,
            duration: 8000
          })
        }
      }
      
      router.push("/admin/bookings")
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tạo đặt phòng: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thêm Đặt Phòng Mới</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin đặt phòng */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Đặt Phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phong">Phòng *</Label>
                <Select 
                  value={formData.idPhong?.toString() || ""} 
                  onValueChange={(value) => handleInputChange('idPhong', parseInt(value))}
                >
                  <SelectTrigger className={errors.idPhong ? "border-red-500" : ""}>
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.idPhong} value={room.idPhong.toString()}>
                        {room.tenPhong}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idPhong && (
                  <p className="text-sm text-red-500 mt-1">{errors.idPhong}</p>
                )}
              </div>

              {/* Khách hàng được nhập tay ở card riêng bên dưới */}

              <div>
                <Label htmlFor="ngayDat">Ngày đặt *</Label>
                <Input
                  id="ngayDat"
                  type="date"
                  value={formData.ngayDat}
                  onChange={(e) => handleInputChange('ngayDat', e.target.value)}
                  className={errors.ngayDat ? "border-red-500" : ""}
                  required
                />
                {errors.ngayDat && (
                  <p className="text-sm text-red-500 mt-1">{errors.ngayDat}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ngayTra">Ngày trả *</Label>
                <Input
                  id="ngayTra"
                  type="date"
                  value={formData.ngayTra}
                  onChange={(e) => handleInputChange('ngayTra', e.target.value)}
                  className={errors.ngayTra ? "border-red-500" : ""}
                  required
                />
                {errors.ngayTra && (
                  <p className="text-sm text-red-500 mt-1">{errors.ngayTra}</p>
                )}
              </div>

              <div>
                <Label htmlFor="trangThai">Trạng thái</Label>
                <Select 
                  value={formData.trangThai} 
                  onValueChange={(value) => handleInputChange('trangThai', value)}
                >
                  <SelectTrigger>
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
            </CardContent>
          </Card>

          {/* Thông tin khách hàng */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Họ tên *</Label>
                <Input value={customerForm.hoTen} onChange={(e) => setCustomerForm((f) => ({ ...f, hoTen: e.target.value }))} className={errors.hoTen ? 'border-red-500' : ''} />
                {errors.hoTen && <p className="text-sm text-red-500 mt-1">{errors.hoTen}</p>}
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={customerForm.email} onChange={(e) => setCustomerForm((f) => ({ ...f, email: e.target.value }))} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label>Số điện thoại *</Label>
                <Input value={customerForm.soDienThoai} onChange={(e) => setCustomerForm((f) => ({ ...f, soDienThoai: e.target.value }))} className={errors.soDienThoai ? 'border-red-500' : ''} />
                {errors.soDienThoai && <p className="text-sm text-red-500 mt-1">{errors.soDienThoai}</p>}
              </div>
              <div>
                <Label>CCCD *</Label>
                <Input value={customerForm.cccd} onChange={(e) => setCustomerForm((f) => ({ ...f, cccd: e.target.value }))} className={errors.cccd ? 'border-red-500' : ''} />
                {errors.cccd && <p className="text-sm text-red-500 mt-1">{errors.cccd}</p>}
              </div>
              <div className="md:col-span-2">
                <Label>Địa chỉ *</Label>
                <Input value={customerForm.diaChi} onChange={(e) => setCustomerForm((f) => ({ ...f, diaChi: e.target.value }))} className={errors.diaChi ? 'border-red-500' : ''} />
                {errors.diaChi && <p className="text-sm text-red-500 mt-1">{errors.diaChi}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Thông tin sản phẩm */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm/Dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="outline" onClick={addProduct}>
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
                    Tổng: {calculateTotal().toLocaleString('vi-VN')}đ
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Thông tin lịch đặt phòng hiện tại */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Lịch đặt phòng hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.idPhong ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  Phòng: <span className="font-medium">{rooms.find(r => r.idPhong === formData.idPhong)?.tenPhong}</span>
                </div>
                {existingBookings.filter(booking => booking.idPhong === formData.idPhong).length > 0 ? (
                  <div className="space-y-2">
                    {existingBookings
                      .filter(booking => booking.idPhong === formData.idPhong)
                      .map((booking, index) => {
                        const customer = customers.find(c => c.idKh === booking.idKh)
                        const isOverlapping = formData.ngayDat && formData.ngayTra ? 
                          !canBookRoomForDates(formData.idPhong!, formData.ngayDat, formData.ngayTra) : false
                        
                        return (
                          <div 
                            key={index} 
                            className={`p-3 border rounded-lg ${
                              isOverlapping ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">
                                  {customer?.hoTen || `Khách hàng #${booking.idKh}`}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(booking.ngayDat).toLocaleDateString('vi-VN')} - {new Date(booking.ngayTra).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Trạng thái: {booking.trangThai || 'N/A'}
                                </div>
                              </div>
                              {isOverlapping && (
                                <div className="text-red-600 text-sm font-medium">
                                  ⚠️ Trùng lịch
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Không có đơn đặt phòng nào cho phòng này
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Vui lòng chọn phòng để xem lịch đặt phòng
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo đặt phòng"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  )
}
