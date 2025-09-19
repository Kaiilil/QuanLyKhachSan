"use client"

import type React from "react"

import SiteHeader from "@/components/site-header"
import { useSession } from "@/hooks/use-session"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { updateProfile, changePassword } from "@/lib/db"
import { findDatPhongByKhachHang, updateDatPhong, type DatPhongDTO } from "@/lib/datphong-api"
import { getAllLoaiPhong, type LoaiPhong } from "@/lib/loai-phong-api"
import { getAllKhachHang } from "@/lib/khachhang-api"
import { getUserById } from "@/lib/users-api"
import { getPhongById } from "@/lib/phong-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatCurrencyVND } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CreditCard, UserRound, History } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const { user, ready } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  useEffect(() => {
    if (!ready) return
    if (!user) router.push("/sign-in")
  }, [user, ready, router])

  const [fullName, setFullName] = useState(user?.fullName ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [address, setAddress] = useState(user?.address ?? "")
  const [isEditing, setIsEditing] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    setFullName(user?.fullName ?? "")
    setPhone(user?.phone ?? "")
    setAddress(user?.address ?? "")
  }, [user])

  // Load thông tin user (số điện thoại, địa chỉ) từ backend theo id
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!user?.id) return
      const numericId = Number(user.id)
      if (!Number.isFinite(numericId)) return
      try {
        const dto = await getUserById(numericId)
        setPhone(dto.soDienThoai || "")
        setAddress(dto.diaChi || "")
        if (!fullName) setFullName(user.username || "")
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Không thể tải thông tin người dùng:", e)
      }
    }
    loadUserInfo()
  }, [user])

  const [history, setHistory] = useState<DatPhongDTO[]>([])
  const [roomTypes, setRoomTypes] = useState<LoaiPhong[]>([])
  const [debugInfo, setDebugInfo] = useState<{
    userEmail: string
    totalCustomers: number
    customerFound: boolean
    customerId: number | null
    customerName: string
    bookingsLoaded: number
    error: string | null
  }>({
    userEmail: "",
    totalCustomers: 0,
    customerFound: false,
    customerId: null,
    customerName: "",
    bookingsLoaded: 0,
    error: null
  })

  useEffect(() => {
    const load = async () => {
      if (!user) return
      
      console.log("🔍 Loading booking history for user:", user.email)
      
      try {
        // Tìm Khách hàng theo email đăng nhập để liên kết lịch sử đặt phòng
        const khList = await getAllKhachHang()
        const email = (user.email || "").toLowerCase()
        const kh = khList.find(k => (k.email || "").toLowerCase() === email)
        const idKh = kh?.idKh
        
        console.log("👥 Customer search result:", {
          userEmail: email,
          totalCustomers: khList.length,
          foundCustomer: !!kh,
          customerId: idKh,
          customerName: kh?.hoTen,
          customerEmail: kh?.email
        })
        
        setDebugInfo({
          userEmail: email,
          totalCustomers: khList.length,
          customerFound: !!kh,
          customerId: idKh || null,
          customerName: kh?.hoTen || "",
          bookingsLoaded: 0,
          error: null
        })
        
        const [his, rts] = await Promise.all([
          idKh ? findDatPhongByKhachHang(idKh) : Promise.resolve([]),
          getAllLoaiPhong(),
        ])
        
        console.log("📋 Loaded data:", {
          bookings: his.length,
          roomTypes: rts.length,
          bookingDetails: his.map(h => ({
            id: h.idDatPhong,
            room: h.idPhong,
            customer: h.idKh,
            checkIn: h.ngayDat,
            checkOut: h.ngayTra,
            status: h.trangThai
          }))
        })
        
        setHistory(his)
        setRoomTypes(rts)
        
        setDebugInfo(prev => ({
          ...prev,
          bookingsLoaded: his.length
        }))
        
      } catch (e: any) {
        console.error("❌ Error loading booking history:", e)
        setDebugInfo(prev => ({
          ...prev,
          error: e.message || "Không thể tải lịch sử đặt phòng"
        }))
        toast({
          title: "Lỗi",
          description: `Không thể tải lịch sử đặt phòng: ${e.message}`,
          variant: "destructive"
        })
      }
    }
    load()
  }, [user, toast])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    try {
      await updateProfile(user.id, { username: user.username, email: user.email, phone, address })
      setIsEditing(false)
      toast({ title: "Đã lưu", description: "Cập nhật thông tin cá nhân thành công" })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!currentPassword || !newPassword) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới", variant: "destructive" })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: "Mật khẩu quá ngắn", description: "Mật khẩu mới phải có ít nhất 6 ký tự", variant: "destructive" })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Không khớp", description: "Xác nhận mật khẩu không khớp", variant: "destructive" })
      return
    }
    try {
      await changePassword(user.id, currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsEditing(false)
      toast({ title: "Thành công", description: "Đổi mật khẩu thành công" })
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Đổi mật khẩu thất bại", variant: "destructive" })
    }
  }

  async function handleCancelBooking(id: number) {
    try {
      const booking = history.find(h => h.idDatPhong === id)
      const currentStatus = booking?.trangThai || ""
      if (currentStatus !== "Chờ xử lý") {
        toast({
          title: "Không thể hủy",
          description: "Chỉ có thể hủy khi đơn đang ở trạng thái 'Chờ xử lý'",
          variant: "destructive"
        })
        return
      }

      const ok = window.confirm("Bạn có chắc muốn hủy đơn đặt phòng này?")
      if (!ok) return

      await updateDatPhong(id, { trangThai: "Đã hủy" })

      setHistory(prev => prev.map(h => h.idDatPhong === id ? { ...h, trangThai: "Đã hủy" } : h))

      toast({
        title: "Đã hủy đơn",
        description: `Đơn #${id} đã được hủy thành công`
      })
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể hủy đơn: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const today = (() => { const d = new Date(); d.setHours(0,0,0,0); return d })()
  const statTotal = history.length
  const statUpcoming = history.filter(h => new Date(h.ngayDat) >= today).length
  const statCompleted = history.filter(h => new Date(h.ngayTra) < today).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/80 backdrop-blur-sm shadow-xl mb-8 card-hover">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-500/10" />
          <div className="relative p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-semibold">Xin chào, {user?.username}</div>
                <div className="text-sm text-gray-600">Quản lý hồ sơ và lịch sử đặt phòng của bạn</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm">
                Tổng đơn: <span className="font-semibold">{statTotal}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm">
                Hoàn tất: <span className="font-semibold">{statCompleted}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
                Sắp tới: <span className="font-semibold">{statUpcoming}</span>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="grid gap-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            <TabsTrigger value="history">Lịch sử đặt phòng</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Họ tên</Label>
                        <div className="mt-1 font-medium">{fullName || user?.username || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <div className="mt-1 font-medium">{user?.email || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Số điện thoại</Label>
                        <div className="mt-1 font-medium">{phone || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Địa chỉ</Label>
                        <div className="mt-1 font-medium">{address || "—"}</div>
                      </div>
                      <Button type="button" variant="outline" className="btn-glow" onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={saveProfile}>
                      {/* Không cho chỉnh sửa họ tên theo yêu cầu */}
                      <div className="space-y-2">
                        <Label>Họ tên</Label>
                        <Input value={fullName || user?.username || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user?.email ?? ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Địa chỉ</Label>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                      <div className="pt-2 border-t" />
                      <div className="space-y-2">
                        <Label>Đổi mật khẩu</Label>
                        <Input type="password" placeholder="Mật khẩu hiện tại" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <Input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <Input type="password" placeholder="Xác nhận mật khẩu mới" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Button type="button" variant="outline" onClick={handleChangePassword}>Đổi mật khẩu</Button>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="btn-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Lưu</Button>
                        <Button type="button" variant="outline" onClick={() => { setFullName(user?.fullName ?? ""); setPhone(user?.phone ?? ""); setAddress(user?.address ?? ""); setIsEditing(false) }}>Hủy</Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl p-5 bg-white/80 border border-blue-100 shadow card-hover">
                  <div className="text-sm text-gray-600">Tổng đơn</div>
                  <div className="text-3xl font-bold mt-1">{statTotal}</div>
                </div>
                <div className="rounded-2xl p-5 bg-white/80 border border-green-100 shadow card-hover">
                  <div className="text-sm text-gray-600">Hoàn tất</div>
                  <div className="text-3xl font-bold mt-1 text-green-600">{statCompleted}</div>
                </div>
                <div className="rounded-2xl p-5 bg-white/80 border border-yellow-100 shadow card-hover">
                  <div className="text-sm text-gray-600">Sắp tới</div>
                  <div className="text-3xl font-bold mt-1 text-yellow-600">{statUpcoming}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {/* Debug Information */}
              <Card className="border-dashed border-gray-300 bg-gray-50">
                <CardContent className="pt-4">
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-800">
                      🔧 Debug Information - Tại sao không hiển thị lịch sử đặt phòng?
                    </summary>
                    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <div><strong>Email người dùng:</strong> {debugInfo.userEmail}</div>
                      <div><strong>Tìm thấy khách hàng:</strong> {debugInfo.customerFound ? '✅ Có' : '❌ Không'}</div>
                      <div><strong>ID khách hàng:</strong> {debugInfo.customerId || 'N/A'}</div>
                      <div><strong>Tên khách hàng:</strong> {debugInfo.customerName || 'N/A'}</div>
                      <div><strong>Tổng khách hàng trong DB:</strong> {debugInfo.totalCustomers}</div>
                      <div><strong>Đặt phòng đã tải:</strong> {debugInfo.bookingsLoaded}</div>
                      <div><strong>Lỗi:</strong> {debugInfo.error || 'Không có'}</div>
                      <div><strong>API Base:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}</div>
                    </div>
                    
                    {!debugInfo.customerFound && debugInfo.userEmail && (
                      <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded text-xs">
                        <strong>⚠️ Vấn đề:</strong> Không tìm thấy khách hàng với email <code>{debugInfo.userEmail}</code> trong database.
                        <br />
                        <strong>Nguyên nhân có thể:</strong>
                        <ul className="list-disc list-inside mt-1">
                          <li>Bạn chưa từng đặt phòng trước đây</li>
                          <li>Email đăng nhập khác với email đặt phòng</li>
                          <li>Dữ liệu khách hàng chưa được đồng bộ</li>
                        </ul>
                      </div>
                    )}
                    
                    {debugInfo.error && (
                      <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-xs">
                        <strong>❌ Lỗi:</strong> {debugInfo.error}
                      </div>
                    )}
                  </details>
                </CardContent>
              </Card>

              {/* Booking History List */}
              {history.map((dp) => {
                const rt = roomTypes.find(r => r.idLoaiPhong === (dp as any).idLoaiPhong)
                const isCompleted = new Date(dp.ngayTra) < today
                const isUpcoming = new Date(dp.ngayDat) >= today
                return (
                  <Card key={dp.idDatPhong} className="border-0 shadow card-hover">
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-8 w-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                            <History className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">Mã đặt phòng: {dp.idDatPhong}</div>
                            <div className="text-sm text-gray-600">Loại phòng: {rt?.tenLoaiPhong || '—'}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(dp.ngayDat).toLocaleDateString('vi-VN')} → {new Date(dp.ngayTra).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={isCompleted ? 'secondary' : isUpcoming ? 'secondary' : 'outline'}>
                            {dp.trangThai || (isCompleted ? 'Hoàn tất' : isUpcoming ? 'Sắp tới' : 'Đang ở')}
                          </Badge>
                          <Button size="sm" variant="outline" className="btn-glow" onClick={() => router.push(`/checkout?datPhongId=${dp.idDatPhong}`)}>
                            Xem/Thanh toán
                          </Button>
                          {dp.trangThai === "Chờ xử lý" ? (
                            <Button size="sm" variant="destructive" className="btn-glow" onClick={() => handleCancelBooking(dp.idDatPhong!)}>
                              Hủy
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {/* No Bookings Message */}
              {history.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-3">🗒️</div>
                  <p className="text-muted-foreground mb-4">
                    {debugInfo.customerFound 
                      ? "Bạn chưa có đơn đặt nào." 
                      : "Không tìm thấy lịch sử đặt phòng cho tài khoản này."
                    }
                  </p>
                  <Button asChild className="btn-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/rooms">Đặt phòng ngay</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
