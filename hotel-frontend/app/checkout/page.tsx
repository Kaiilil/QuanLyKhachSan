"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SiteHeader from "@/components/site-header"
import { updateThanhToan, getThanhToanByDatPhong, getThanhToanById, getAllThanhToan, createThanhToan, type ThanhToanDTO } from "@/lib/thanhtoan-api"
import { getAllDatPhongSanPham, type DatPhongSanPhamDTO } from "@/lib/datphong-sanpham-api"
import { getDatPhongById, getAllDatPhong, type DatPhongDTO } from "@/lib/datphong-api"
import { getPhongById, type PhongDTO } from "@/lib/phong-api"
import { getKhachHangById, getAllKhachHang, type KhachHangDTO } from "@/lib/khachhang-api"
import { getLoaiPhongById, type LoaiPhong } from "@/lib/loai-phong-api"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Search, CreditCard, Package } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const params = useSearchParams()
  const datPhongIdFromUrl = params.get("datPhongId")
  
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [searchDatPhongId, setSearchDatPhongId] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [searchPaymentId, setSearchPaymentId] = useState("")
  const [searchPaymentEmail, setSearchPaymentEmail] = useState("")
  const [searchMethod, setSearchMethod] = useState<"id" | "payment" | "payment_email">("id")
  const [datPhong, setDatPhong] = useState<DatPhongDTO | null>(null)
  const [phong, setPhong] = useState<PhongDTO | null>(null)
  const [khachHang, setKhachHang] = useState<KhachHangDTO | null>(null)
  const [loaiPhong, setLoaiPhong] = useState<LoaiPhong | null>(null)
  const [thanhToan, setThanhToan] = useState<ThanhToanDTO | null>(null)
  const [sanPhamList, setSanPhamList] = useState<DatPhongSanPhamDTO[]>([])
  const [method, setMethod] = useState<"MOMO" | "ZALOPAY" | "VNPAY" | "CREDIT_CARD">("CREDIT_CARD")
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")
  const [datPhongList, setDatPhongList] = useState<DatPhongDTO[]>([])
  const [showDatPhongList, setShowDatPhongList] = useState(false)
  const [searchResult, setSearchResult] = useState<"success" | "not_found" | "error" | null>(null)
  const [searchMessage, setSearchMessage] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      if (datPhongIdFromUrl) {
        try {
          await loadBookingData(datPhongIdFromUrl)
          setSearchMode(false) // Chế độ hiển thị thông tin đặt phòng
        } catch (error: any) {
          // Xử lý NOT_FOUND và lỗi khác thân thiện, không ném lỗi ra console
          if (error?.message === "NOT_FOUND") {
            setSearchMode(true)
            setSearchResult("not_found")
            setSearchMessage("Không tìm thấy đặt phòng với mã này")
          } else {
            setSearchMode(true)
            setSearchResult("error")
            setSearchMessage(`Không thể tải thông tin đặt phòng: ${error?.message || "Lỗi không xác định"}`)
          }
        }
      } else {
        setSearchMode(true) // Chế độ tìm kiếm khi không có datPhongId
      }
    })()
  }, [datPhongIdFromUrl])

  async function loadBookingData(datPhongId: string) {
    try {
      setLoading(true)
      
      // Lấy thông tin đặt phòng
      let datPhongData: DatPhongDTO
      try {
        const result = await getDatPhongById(parseInt(datPhongId))
        if (!result) {
          throw new Error("NOT_FOUND")
        }
        datPhongData = result
        setDatPhong(datPhongData)
      } catch (error: any) {
        if (error?.message === "NOT_FOUND") {
          throw new Error("NOT_FOUND")
        }
        console.warn("Error loading dat phong:", error)
        throw new Error(`Không thể tải thông tin đặt phòng #${datPhongId}: ${error?.message || "Lỗi không xác định"}`)
      }
      
      // Lấy thông tin phòng
      let phongData: PhongDTO
      try {
        if (!datPhongData.idPhong) {
          throw new Error("Đặt phòng không có thông tin phòng")
        }
        phongData = await getPhongById(datPhongData.idPhong)
      setPhong(phongData)
      } catch (error: any) {
        console.error("Error loading phong:", error)
        throw new Error(`Không thể tải thông tin phòng: ${error.message}`)
      }
      
      // Lấy thông tin khách hàng
      let khachHangData: KhachHangDTO
      try {
        if (!datPhongData.idKh) {
          throw new Error("Đặt phòng không có thông tin khách hàng")
        }
        khachHangData = await getKhachHangById(datPhongData.idKh)
      setKhachHang(khachHangData)
      } catch (error: any) {
        console.error("Error loading khach hang:", error)
        throw new Error(`Không thể tải thông tin khách hàng: ${error.message}`)
      }
      
      // Lấy thông tin loại phòng
      try {
        if (!phongData.idLoaiPhong) {
          console.warn("Phòng không có thông tin loại phòng")
          setLoaiPhong(null)
        } else {
          const loaiPhongData = await getLoaiPhongById(phongData.idLoaiPhong)
      setLoaiPhong(loaiPhongData)
        }
      } catch (error: any) {
        console.warn("Error loading loai phong:", error)
        setLoaiPhong(null)
      }
      
      // Lấy thông tin thanh toán
      try {
      const thanhToanList = await getThanhToanByDatPhong(parseInt(datPhongId))
      if (thanhToanList.length > 0) {
        setThanhToan(thanhToanList[0])
        setPaymentStatus(thanhToanList[0].trangThai || "pending")
        } else {
          setThanhToan(null)
          setPaymentStatus("pending")
        }
      } catch (error: any) {
        console.warn("Error loading thanh toan:", error)
        setThanhToan(null)
        setPaymentStatus("pending")
      }
      
      // Lấy thông tin sản phẩm
      try {
      const sanPhamData = await getAllDatPhongSanPham()
      const sanPhamOfBooking = sanPhamData.filter(sp => sp.idDatPhong === parseInt(datPhongId))
      setSanPhamList(sanPhamOfBooking)
      } catch (error: any) {
        console.warn("Error loading san pham:", error)
        setSanPhamList([])
      }
      
      // Set success result
      setSearchResult("success")
      setSearchMessage("Tìm thấy thông tin đặt phòng!")
      
    } catch (error: any) {
      console.error("Error loading booking data:", error)
      // Reset tất cả state khi có lỗi
      setDatPhong(null)
      setPhong(null)
      setKhachHang(null)
      setLoaiPhong(null)
      setThanhToan(null)
      setSanPhamList([])
      
      // Không set search result ở đây vì function gọi sẽ xử lý
      throw error // Re-throw để function gọi có thể xử lý
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchMethod === "id") {
      if (!searchDatPhongId.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mã đặt phòng",
          variant: "destructive"
        })
        return
      }
      // Validate mã đặt phòng phải là số
      if (!/^\d+$/.test(searchDatPhongId.trim())) {
        toast({
          title: "Lỗi",
          description: "Mã đặt phòng phải là số",
          variant: "destructive"
        })
        return
      }
      
      try {
        await loadBookingData(searchDatPhongId.trim())
        setSearchResult("success")
        setSearchMessage("Tìm thấy thông tin đặt phòng!")
      } catch (error: any) {
        if (error.message === "NOT_FOUND") {
          setSearchResult("not_found")
          setSearchMessage("Không tìm thấy đặt phòng với mã này")
    } else {
          setSearchResult("error")
          setSearchMessage(`Lỗi tải thông tin: ${error.message}`)
        }
      }

    } else if (searchMethod === "payment") {
      if (!searchPaymentId.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mã thanh toán",
          variant: "destructive"
        })
        return
      }
      // Validate mã thanh toán phải là số
      if (!/^\d+$/.test(searchPaymentId.trim())) {
        toast({
          title: "Lỗi",
          description: "Mã thanh toán phải là số",
          variant: "destructive"
        })
        return
      }
      searchByPaymentId(searchPaymentId.trim())
    } else if (searchMethod === "payment_email") {
      if (!searchPaymentEmail.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập email",
          variant: "destructive"
        })
        return
      }
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchPaymentEmail.trim())) {
        toast({
          title: "Lỗi",
          description: "Email không đúng định dạng",
          variant: "destructive"
        })
        return
      }
      searchByPaymentEmail(searchPaymentEmail.trim())
    }
  }

  const searchByEmail = async (email: string) => {
    try {
      setLoading(true)
      setSearchResult(null)
      setSearchMessage("")
      
      // Lấy tất cả khách hàng
      const khachHangList = await getAllKhachHang()
      
      // Tìm khách hàng theo email
      const khachHang = khachHangList.find(kh => 
        kh.email && kh.email.toLowerCase() === email.toLowerCase()
      )
      
      if (!khachHang) {
        setSearchResult("not_found")
        setSearchMessage("Email không tồn tại trong hệ thống")
        return
      }
      
      // Lấy tất cả đặt phòng của khách hàng này
      const datPhongList = await getAllDatPhong()
      const datPhongOfKhachHang = datPhongList.filter(dp => dp.idKh === khachHang.idKh)
      
      if (datPhongOfKhachHang.length === 0) {
        setSearchResult("not_found")
        setSearchMessage("Khách hàng này chưa có đặt phòng nào")
        return
      }
      
      // Nếu có nhiều đặt phòng, hiển thị danh sách để chọn
      if (datPhongOfKhachHang.length > 1) {
        setDatPhongList(datPhongOfKhachHang)
        setShowDatPhongList(true)
        setSearchResult("success")
        setSearchMessage(`Tìm thấy ${datPhongOfKhachHang.length} đơn đặt phòng`)
      } else {
        // Nếu chỉ có 1 đặt phòng, load trực tiếp
        await loadBookingData(datPhongOfKhachHang[0].idDatPhong!.toString())
        setSearchResult("success")
        setSearchMessage("Tìm thấy thông tin đặt phòng!")
      }
      
    } catch (error: any) {
      console.error("Error searching by email:", error)
      setSearchResult("error")
      setSearchMessage(`Không thể tìm kiếm: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const searchByPaymentId = async (paymentId: string) => {
    try {
      setLoading(true)
      setSearchResult(null)
      setSearchMessage("")
      
      // Lấy thông tin thanh toán theo ID
      const thanhToan = await getThanhToanById(parseInt(paymentId))
      
      if (!thanhToan) {
        setSearchResult("not_found")
        setSearchMessage("Mã thanh toán không tồn tại trong hệ thống")
        return
      }
      
      // Kiểm tra xem thanh toán có liên kết với đặt phòng không
      if (!thanhToan.idDatPhong) {
        setSearchResult("not_found")
        setSearchMessage("Thanh toán này không liên kết với đơn đặt phòng nào")
        return
      }
      
      // Lấy thông tin đặt phòng từ thanh toán
      try {
        await loadBookingData(thanhToan.idDatPhong.toString())
        setSearchResult("success")
        setSearchMessage("Tìm thấy thông tin đặt phòng!")
      } catch (bookingError: any) {
        console.error("Error loading booking data:", bookingError)
        if (bookingError.message === "NOT_FOUND") {
          setSearchResult("not_found")
          setSearchMessage("Không tìm thấy thông tin đặt phòng cho thanh toán này")
        } else {
          setSearchResult("error")
          setSearchMessage(`Lỗi tải thông tin đặt phòng: ${bookingError.message}`)
        }
      }
      
    } catch (error: any) {
      console.error("Error searching by payment ID:", error)
      
      // Xử lý các loại lỗi khác nhau
      if (error.message.includes("HTTP error! status: 404")) {
        setSearchResult("not_found")
        setSearchMessage("Mã thanh toán không tồn tại trong hệ thống")
      } else if (error.message.includes("Không thể tải thông tin thanh toán")) {
        setSearchResult("error")
        setSearchMessage("Không thể kết nối đến hệ thống thanh toán. Vui lòng thử lại sau.")
      } else {
        setSearchResult("error")
        setSearchMessage(`Không thể tìm kiếm: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Tìm kiếm đơn đặt phòng theo ID (kể cả chưa thanh toán)
  const searchByBookingId = async (bookingId: string) => {
    try {
      setLoading(true)
      setSearchResult(null)
      setSearchMessage("")
      
      // Lấy thông tin đặt phòng theo ID
      const datPhong = await getDatPhongById(parseInt(bookingId))
      
      if (!datPhong) {
        setSearchResult("not_found")
        setSearchMessage("Không tìm thấy đơn đặt phòng với mã này")
        return
      }
      
      // Load thông tin đặt phòng
      await loadBookingData(bookingId)
      setSearchResult("success")
      setSearchMessage("Tìm thấy thông tin đặt phòng!")
      
    } catch (error: any) {
      console.error("Error searching by booking ID:", error)
      setSearchResult("error")
      setSearchMessage(`Không thể tìm kiếm: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const searchByPaymentEmail = async (email: string) => {
    try {
      setLoading(true)
      setSearchResult(null)
      setSearchMessage("")
      
      // Lấy tất cả thanh toán trước (giống như admin)
      const allThanhToan = await getAllThanhToan()
      
      // Lấy tất cả đặt phòng và khách hàng
      const [datPhongList, khachHangList] = await Promise.all([
        getAllDatPhong(),
        getAllKhachHang()
      ])
      
      // Tìm thanh toán theo email (logic giống admin)
      const thanhToanOfEmail = allThanhToan.filter((tt: ThanhToanDTO) => {
        if (!tt.idDatPhong) return false
        
        // Tìm đặt phòng tương ứng
        const datPhong = datPhongList.find(dp => dp.idDatPhong === tt.idDatPhong)
        if (!datPhong || !datPhong.idKh) return false
        
        // Tìm khách hàng tương ứng
        const khachHang = khachHangList.find(kh => kh.idKh === datPhong.idKh)
        if (!khachHang || !khachHang.email) return false
        
        // So sánh email (không phân biệt hoa thường)
        return khachHang.email.toLowerCase() === email.toLowerCase()
      })
      
      if (thanhToanOfEmail.length === 0) {
        setSearchResult("not_found")
        setSearchMessage("Không tìm thấy thanh toán nào cho email này")
        return
      }
      
      // Lấy danh sách đặt phòng tương ứng
      const datPhongIds = thanhToanOfEmail.map(tt => tt.idDatPhong).filter(Boolean)
      const datPhongOfEmail = datPhongList.filter(dp => datPhongIds.includes(dp.idDatPhong))
      
      // Nếu có nhiều thanh toán, hiển thị danh sách để chọn
      if (thanhToanOfEmail.length > 1) {
        setDatPhongList(datPhongOfEmail)
        setShowDatPhongList(true)
        setSearchResult("success")
        setSearchMessage(`Tìm thấy ${thanhToanOfEmail.length} thanh toán của khách hàng này`)
      } else {
        // Nếu chỉ có 1 thanh toán, load trực tiếp
        await loadBookingData(thanhToanOfEmail[0].idDatPhong!.toString())
        setSearchResult("success")
        setSearchMessage("Tìm thấy thông tin thanh toán!")
      }
      
    } catch (error: any) {
      console.error("Error searching by payment email:", error)
      setSearchResult("error")
      setSearchMessage(`Không thể tìm kiếm: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function pay() {
    if (!datPhong || !phong || !khachHang) {
      toast({
        title: "Lỗi",
        description: "Thông tin đặt phòng không đầy đủ",
        variant: "destructive"
      })
      return
    }

    setPaying(true)
    try {
      let updatedThanhToan: ThanhToanDTO
      
      if (thanhToan) {
        // Cập nhật thanh toán hiện có
        updatedThanhToan = await updateThanhToan(thanhToan.idTt!, {
        trangThai: "Đã thanh toán",
          hinhThucTt: "payment"
        })
      } else {
        // Tạo thanh toán mới
        const newThanhToan = {
          idDatPhong: datPhong.idDatPhong!,
          ngayTt: new Date().toISOString(),
          ngayDat: datPhong.ngayDat!,
          ngayTra: datPhong.ngayTra!,
          soTien: loaiPhong?.gia || 0,
          hinhThucTt: "payment",
          trangThai: "Đã thanh toán"
        }
        
        // Gọi API tạo thanh toán mới
        updatedThanhToan = await createThanhToan(newThanhToan)
      }
      
      // Cập nhật state
      setThanhToan(updatedThanhToan)
      setPaymentStatus("Đã thanh toán")
      
      toast({
        title: "💳 Thanh toán thành công!",
        description: `Đơn đặt phòng đã được thanh toán thành công.\nMã đặt phòng: ${datPhong?.idDatPhong}\nMã thanh toán: ${updatedThanhToan.idTt}\nPhương thức: ${method}\nTổng tiền: ${updatedThanhToan.soTien?.toLocaleString('vi-VN')} VNĐ`,
        duration: 8000
      })
      
      // Chuyển về trang trước đó sau 5 giây để người dùng đọc thông báo
      setTimeout(() => {
        router.back()
      }, 5000)
      
    } catch (error: any) {
      toast({
        title: "❌ Thanh toán thất bại",
        description: `Không thể xử lý thanh toán: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setPaying(false)
    }
  }

  // Trang tìm kiếm đặt phòng
  if (searchMode && !datPhong) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">Thanh toán đặt phòng</h1>
            <p className="text-gray-600">Nhập thông tin để tìm đơn và tiến hành thanh toán</p>
          </div>

          <Card className="max-w-md mx-auto border-0 shadow-xl card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Tìm đặt phòng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Phương thức tìm kiếm</Label>
                <Select value={searchMethod} onValueChange={(v) => {
                  setSearchMethod(v as "id" | "payment" | "payment_email")
                  // Reset các trường tìm kiếm khi thay đổi phương thức
                  setSearchDatPhongId("")
                  setSearchEmail("")
                  setSearchPaymentId("")
                  setSearchPaymentEmail("")
                  setSearchResult(null)
                  setSearchMessage("")
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Tìm theo mã đặt phòng</SelectItem>
                    <SelectItem value="payment">Tìm theo mã thanh toán</SelectItem>
                    <SelectItem value="payment_email">Tìm thanh toán theo email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {searchMethod === "id" ? (
                <div>
                  <Label htmlFor="datPhongId">Mã đặt phòng</Label>
                  <Input
                    id="datPhongId"
                    placeholder="Nhập mã đặt phòng..."
                    value={searchDatPhongId}
                    onChange={(e) => setSearchDatPhongId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              ) : searchMethod === "payment" ? (
                <div>
                  <Label htmlFor="searchPaymentId">Mã thanh toán</Label>
                  <Input
                    id="searchPaymentId"
                    placeholder="Nhập mã thanh toán..."
                    value={searchPaymentId}
                    onChange={(e) => setSearchPaymentId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="searchPaymentEmail">Email khách hàng</Label>
                  <Input
                    id="searchPaymentEmail"
                    type="email"
                    placeholder="Nhập email khách hàng..."
                    value={searchPaymentEmail}
                    onChange={(e) => setSearchPaymentEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              )}
              
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full btn-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? "Đang tìm..." : `Tìm ${
                  searchMethod === "id" ? "đặt phòng" : 
                  searchMethod === "payment" ? "thanh toán" :
                  "thanh toán theo email"
                }`}
              </Button>
              
              {/* Hiển thị kết quả tìm kiếm */}
              {searchResult && (
                <div className={`p-4 rounded-lg border ${
                  searchResult === "success" 
                    ? "bg-green-50 border-green-200 text-green-800" 
                    : searchResult === "not_found" 
                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  <div className="flex items-center gap-2">
                    {searchResult === "success" && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {searchResult === "not_found" && (
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    )}
                    {searchResult === "error" && (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✗</span>
                      </div>
                    )}
                    <span className="font-medium">
                      {searchResult === "success" ? "Thành công" : 
                       searchResult === "not_found" ? "Không tìm thấy" : "Lỗi"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{searchMessage}</p>
              </div>
              )}
              

            </CardContent>
          </Card>

          {/* Danh sách đặt phòng khi tìm bằng email */}
          {showDatPhongList && datPhongList.length > 0 && (
            <Card className="max-w-2xl mx-auto mt-6 border-0 shadow-xl card-hover">
              <CardHeader>
                <CardTitle>Chọn đặt phòng để thanh toán</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tìm thấy {datPhongList.length} đặt phòng của khách hàng này
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {datPhongList.map((dp) => (
                    <div 
                      key={dp.idDatPhong} 
                      className="border rounded-lg p-4 hover:bg-blue-50/50 cursor-pointer card-hover"
                      onClick={() => {
                        loadBookingData(dp.idDatPhong!.toString())
                        setShowDatPhongList(false)
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Mã đặt phòng: {dp.idDatPhong}</p>
                          <p className="text-sm text-muted-foreground">
                            Ngày nhận: {dp.ngayDat ? format(new Date(dp.ngayDat), 'dd/MM/yyyy') : 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ngày trả: {dp.ngayTra ? format(new Date(dp.ngayTra), 'dd/MM/yyyy') : 'N/A'}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Chọn
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDatPhongList(false)}
                    className="text-sm"
                  >
                    Quay lại tìm kiếm
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
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

  if (!datPhong || !phong || !khachHang || !loaiPhong) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Không tìm thấy thông tin đặt phòng.</p>
            <Button onClick={() => router.back()}>
              Quay về trang trước
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const nights = Math.max(
    1,
    Math.ceil((new Date(datPhong.ngayTra!).getTime() - new Date(datPhong.ngayDat!).getTime()) / (1000 * 60 * 60 * 24)),
  )

  // Nếu đã thanh toán thành công
  if (paymentStatus === "Đã thanh toán") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 mb-4">Đơn đặt phòng của bạn đã được thanh toán thành công.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-sm text-gray-600">Mã đặt phòng:</span>
                  <p className="font-semibold">{datPhong.idDatPhong}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Mã thanh toán:</span>
                  <p className="font-semibold">{thanhToan?.idTt}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phòng:</span>
                  <p className="font-semibold">{phong.tenPhong}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tổng tiền:</span>
                  <p className="font-semibold text-green-600">{thanhToan?.soTien?.toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </div>
            </div>
            
            <Button onClick={() => {
              console.log("Quay lại trang checkout")
              // Reset tất cả state để quay về trang checkout sạch
              setSearchMode(true)
              setDatPhong(null)
              setPhong(null)
              setKhachHang(null)
              setLoaiPhong(null)
              setThanhToan(null)
              setSanPhamList([])
              setSearchResult(null)
              setSearchMessage("")
              setShowDatPhongList(false)
              setDatPhongList([])
              console.log("Đã quay về trang checkout")
            }} size="lg">
              Quay lại
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Thông tin đặt phòng */}
        <Card className="border-0 shadow-xl card-hover">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Thông tin đặt phòng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Mã đặt phòng</Label>
                <p className="font-semibold">{datPhong.idDatPhong}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phòng</Label>
                <p className="font-semibold">{phong.tenPhong}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Loại phòng</Label>
                <p className="font-semibold">{loaiPhong.tenLoaiPhong}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Số đêm</Label>
                <p className="font-semibold">{nights} đêm</p>
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
              <Label className="text-sm font-medium text-muted-foreground">Khách hàng</Label>
              <p className="font-semibold">{khachHang.hoTen}</p>
              <p className="text-sm text-muted-foreground">{khachHang.soDienThoai}</p>
            </div>
            
            {/* Thông tin sản phẩm */}
            {sanPhamList.length > 0 && (
              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Sản phẩm/Dịch vụ
                </Label>
                <div className="space-y-2">
                  {sanPhamList.map((sanPham, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>Sản phẩm #{sanPham.idSp} (SL: {sanPham.soLuong})</span>
                      <span className="font-medium">-</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Tổng tiền:</span>
                <span className="text-2xl font-bold text-green-600">
                  {thanhToan?.soTien ? 
                    `${thanhToan.soTien.toLocaleString('vi-VN')} VNĐ` : 
                    "Chưa có thông tin thanh toán"
                  }
                </span>
              </div>
              {!thanhToan && (
                <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  ⚠️ Đơn đặt phòng này chưa có thông tin thanh toán. Bạn có thể tiến hành thanh toán ngay.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Thanh toán */}
        <Card className="border-0 shadow-xl card-hover">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Thanh toán</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${
                paymentStatus === "Đã thanh toán" ? "bg-green-500" : 
                paymentStatus === "Chờ thanh toán" ? "bg-yellow-500" : 
                paymentStatus === "Thanh toán thất bại" ? "bg-red-500" : "bg-gray-500"
              }`}></div>
              <span className={`text-sm font-medium ${
                paymentStatus === "Đã thanh toán" ? "text-green-600" : 
                paymentStatus === "Chờ thanh toán" ? "text-yellow-600" : 
                paymentStatus === "Thanh toán thất bại" ? "text-red-600" : "text-gray-600"
              }`}>
                Trạng thái: {paymentStatus === "Đã thanh toán" ? "Đã thanh toán" : 
                             paymentStatus === "Chờ thanh toán" ? "Chờ thanh toán" : 
                             paymentStatus === "Thanh toán thất bại" ? "Thanh toán thất bại" : "Chưa xác định"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phương thức thanh toán</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDIT_CARD">Thẻ tín dụng</SelectItem>
                  <SelectItem value="MOMO">MoMo</SelectItem>
                  <SelectItem value="ZALOPAY">ZaloPay</SelectItem>
                  <SelectItem value="VNPAY">VNPay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full btn-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
              onClick={pay}
              disabled={paying || paymentStatus === "Đã thanh toán"}
              size="lg"
            >
              {paying ? "Đang xử lý..." : 
               paymentStatus === "Đã thanh toán" ? "Đã thanh toán" : 
               "Thanh toán ngay"}
            </Button>
            
            {paymentStatus === "Đã thanh toán" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-medium">Đơn đặt phòng đã được thanh toán thành công!</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Bạn có thể về trang chủ hoặc xem thông tin chi tiết ở trên.
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Thông tin thanh toán:</p>
                  <ul className="space-y-1">
                    <li>• Sẽ cập nhật trạng thái thành "Đã thanh toán"</li>
                    <li>• Hiển thị thông báo thành công</li>
                    <li>• Tự động chuyển về trang chủ sau 5 giây</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
