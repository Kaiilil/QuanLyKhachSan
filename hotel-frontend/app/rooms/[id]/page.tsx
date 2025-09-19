"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import SiteHeader from "@/components/site-header"
import { getLoaiPhongById, type LoaiPhong } from "@/lib/loai-phong-api"
import { Badge } from "@/components/ui/badge"
import { formatCurrencyVND } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import RoomDevicesList from "@/components/room-devices-list"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { findRoomsByRoomType, getPhongDetailById, type PhongDTO, type PhongDetailDTO } from "@/lib/phong-api"
import { getRoomTypeById } from "@/lib/db"
import BookingModal from "@/components/booking-modal"
import { createDatPhong } from "@/lib/datphong-api"
import { useSession } from "@/hooks/use-session"
import { 
  Users, 
  Square, 
  Eye, 
  Wifi, 
  Car, 
  Coffee, 
  Tv, 
  MapPin,
  Star,
  Calendar,
  ArrowLeft,
  Heart,
  AlertCircle,
  RefreshCw,
  Info,
  Shield,
  Clock
} from "lucide-react"
import type { RoomType } from "@/lib/types"

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useSession()
  const [room, setRoom] = useState<RoomType | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // Rooms of this room-type
  const [roomsOfType, setRoomsOfType] = useState<PhongDTO[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)

  // Dialog state
  const [openRoomId, setOpenRoomId] = useState<number | null>(null)
  const [roomDetail, setRoomDetail] = useState<PhongDetailDTO | null>(null)
  const [roomDetailLoading, setRoomDetailLoading] = useState(false)
  const [roomTypeImage, setRoomTypeImage] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  // Cache roomDetail để tránh bị reset
  const [cachedRoomDetail, setCachedRoomDetail] = useState<{[key: number]: PhongDetailDTO}>({})
  const [checkIn, setCheckIn] = useState<string>("")
  const [checkOut, setCheckOut] = useState<string>("")
  const [bookingSubmitting, setBookingSubmitting] = useState(false)

  const unitFilterParam = searchParams?.get("unitId") || ""

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setError(null)
      setErrorDetails(null)
      try {
        const id = params?.id ? String(params.id) : ""
        if (!id) {
          if (mounted) {
            setError("Thiếu mã loại phòng")
            setErrorDetails("URL không chứa ID loại phòng hợp lệ")
          }
          return
        }

        const loaiPhongData = await getLoaiPhongById(Number(id))
        if (!mounted) return
        if (!loaiPhongData) {
          setError("Không tìm thấy loại phòng")
          setErrorDetails(`Không thể tải dữ liệu cho loại phòng ID: ${id}`)
        } else {
          // Map LoaiPhong -> RoomType (giống như trang chính)
          const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
          const toAbsolute = (p?: string): string | undefined => {
            if (!p) return undefined
            if (p.startsWith("http")) return p
            if (p.startsWith("/uploads/")) return apiBase + p
            if (p.startsWith("uploads/")) return apiBase + "/" + p
            if (p.startsWith("/rooms/")) return apiBase + "/uploads" + p
            if (p.startsWith("rooms/")) return apiBase + "/uploads/" + p
            // Nếu là filename đơn giản (không có path), sử dụng API endpoint
            if (!p.includes("/") && !p.includes("\\")) {
              return `${apiBase}/api/upload/images/${p}`
            }
            return apiBase + p
          }
          
          const firstImgPath: string | undefined = loaiPhongData.hinhAnh || loaiPhongData.anhphong || undefined
          const firstImgAbs: string | undefined = toAbsolute(firstImgPath)
          
          const roomData: RoomType = {
            id: String(loaiPhongData.idLoaiPhong),
            name: loaiPhongData.tenLoaiPhong,
            price: loaiPhongData.gia,
            description: loaiPhongData.moTa || "",
            sizeM2: 0,
            capacity: 2,
            view: "Không rõ",
            images: firstImgAbs ? [firstImgAbs] : [],
            amenities: [],
            devices: [],
          }
          
          setRoom(roomData)
        }

        // Load rooms of this room-type
        setRoomsLoading(true)
        const rtRooms = await findRoomsByRoomType(Number(id))
        if (!mounted) return
        setRoomsOfType(rtRooms || [])
      } catch (e) {
        if (mounted) {
          const errorMessage = e instanceof Error ? e.message : "Lỗi không xác định"
          setError("Có lỗi xảy ra khi tải dữ liệu")
          setErrorDetails(`Chi tiết lỗi: ${errorMessage}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          setRoomsLoading(false)
        }
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [params?.id])

  // Auto open dialog if query ?roomId=...
  useEffect(() => {
    const qRoomId = searchParams?.get("roomId")
    if (qRoomId) {
      const idNum = Number(qRoomId)
      if (!Number.isNaN(idNum)) {
        handleOpenRoom(idNum)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const filteredRooms = useMemo(() => {
    if (!unitFilterParam) return roomsOfType
    return roomsOfType.filter((r) => String(r.idDvi) === String(Number(unitFilterParam)))
  }, [roomsOfType, unitFilterParam])

  const handleRetry = () => {
    router.refresh()
  }

  const handleOpenRoom = async (idPhong: number) => {
    console.log("[RoomDetailPage] Open room dialog for idPhong:", idPhong)
    setOpenRoomId(idPhong)
    
    // Kiểm tra cache trước
    if (cachedRoomDetail[idPhong]) {
      console.log("[RoomDetailPage] Sử dụng cached roomDetail cho roomId:", idPhong)
      setRoomDetail(cachedRoomDetail[idPhong])
      return
    }
    
    // Chỉ load nếu chưa có trong cache
    if (!roomDetail || roomDetail.idPhong !== idPhong) {
      setRoomDetailLoading(true)
      try {
        const detail = await getPhongDetailById(idPhong)
        console.log("[RoomDetailPage] getPhongDetailById result:", detail)
        setRoomDetail(detail)
        setCachedRoomDetail(prev => ({ ...prev, [idPhong]: detail }))
        setRoomTypeImage(null)
        
        // Lấy ảnh của loại phòng nếu phòng không có ảnh
        if (detail && !detail.anhPhong && detail.idLoaiPhong) {
          try {
            const roomType = await getRoomTypeById(String(detail.idLoaiPhong))
            if (roomType && roomType.images && roomType.images.length > 0) {
              setRoomTypeImage(roomType.images[0])
            }
          } catch (e) {
            console.warn("Không thể lấy ảnh loại phòng:", e)
          }
        }
      } catch (e) {
        console.error("[RoomDetailPage] getPhongDetailById error:", e)
      } finally {
        setRoomDetailLoading(false)
      }
    }
  }

  const handleQuickBook = async () => {
    if (!openRoomId) return
    if (!user) {
      alert("Vui lòng đăng nhập để đặt phòng")
      router.push("/auth/sign-in")
      return
    }
    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày nhận và trả phòng")
      return
    }
    try {
      setBookingSubmitting(true)
      await createDatPhong({
        idPhong: openRoomId,
        idKh: Number(user.id) || 0,
        ngayDat: checkIn,
        ngayTra: checkOut,
        trangThai: "Chờ xử lý",
      })
      alert("Đặt phòng thành công!")
    } catch (e: any) {
      alert(e?.message || "Đặt phòng thất bại")
    } finally {
      setBookingSubmitting(false)
    }
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const toAbsolute = (p?: string): string | undefined => {
    if (!p) return undefined
    if (p.startsWith("http")) return p
    if (p.startsWith("/uploads/")) return apiBase + p
    if (p.startsWith("uploads/")) return apiBase + "/" + p
    if (p.startsWith("/rooms/")) return apiBase + "/uploads" + p
    if (p.startsWith("rooms/")) return apiBase + "/uploads/" + p
    // Nếu là filename đơn giản (không có path), thử cả API endpoint và static path
    if (!p.includes("/") && !p.includes("\\")) {
      // Thử static path trước
      return `${apiBase}/uploads/rooms/${p}`
    }
    return apiBase + p
  }
  


  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-[16/10] bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-[16/10] bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-600 text-lg font-medium">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
                {errorDetails && (
                  <div className="text-sm text-red-500 bg-red-100 p-3 rounded-lg">
                    {errorDetails}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Thử lại
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/rooms")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Không tìm thấy loại phòng.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const images = room.images && room.images.length > 0 ? room.images : ["/placeholder.svg?height=600&width=900"]
  const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SiteHeader />
      
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/rooms")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Danh sách phòng
        </Button>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border shadow-lg group">
                <img
                  src={images[safeIndex]}
                  alt={`Ảnh ${room.name}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        i === safeIndex 
                          ? "border-blue-500 ring-2 ring-blue-200" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Xem ảnh ${i + 1}`}
                    >
                      <img src={src} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Information Cards */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">Sức chứa</div>
                        <div className="font-semibold">{room.capacity || 2} khách</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                      <Square className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">Diện tích</div>
                        <div className="font-semibold">{room.sizeM2 || 20} m²</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                      <Eye className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">View</div>
                        <div className="font-semibold">{room.view || "Biển"}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Mô tả</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {room.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Coffee className="w-5 h-5 text-orange-500" />
                      Tiện ích
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-orange-50">
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rooms of this type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Tv className="w-5 h-5 text-blue-500" />
                    Danh sách phòng thuộc loại này
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roomsLoading ? (
                    <div className="text-sm text-muted-foreground">Đang tải danh sách phòng...</div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Chưa có phòng nào cho loại này{unitFilterParam ? ` tại đơn vị ${unitFilterParam}` : ""}.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredRooms.map((r) => {
                        const img = toAbsolute(r.anhPhong) || "/placeholder.svg?height=300&width=500"
                        const statusColor = r.trangThai === "Trống" ? "bg-emerald-100 text-emerald-700" : r.trangThai === "Đang sử dụng" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                        return (
                          <div key={r.idPhong} className="flex gap-3 rounded-xl border p-3 bg-white">
                            <div className="w-28 h-20 rounded-lg overflow-hidden border">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt={r.tenPhong} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="font-medium truncate">{r.tenPhong}</div>
                                <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>{r.trangThai}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">Đơn vị: {r.idDvi} • Tầng: {r.idTang}</div>
                              <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleOpenRoom(r.idPhong)}>Xem chi tiết</Button>
                                <Button size="sm" onClick={() => { setBookingOpen(true); setOpenRoomId(r.idPhong) }}>Đặt phòng này</Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Main Booking Card */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">{room.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Khách sạn Premium</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrencyVND(room.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">/đêm</div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sức chứa:</span>
                      <span className="font-medium">{room.capacity || 2} khách</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Diện tích:</span>
                      <span className="font-medium">{room.sizeM2 || 20} m²</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">View:</span>
                      <span className="font-medium">{room.view || "Không rõ"}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick booking inside dialog */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Ngày nhận phòng</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={checkIn} onChange={(e)=>setCheckIn(e.target.value)} />
                    <label className="text-sm text-muted-foreground">Ngày trả phòng</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={checkOut} onChange={(e)=>setCheckOut(e.target.value)} />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                      disabled={bookingSubmitting}
                      onClick={async () => { 
                        if (filteredRooms.length > 0) {
                          const roomId = filteredRooms[0].idPhong
                          console.log("[RoomDetailPage] Bấm đặt phòng, roomId:", roomId, "roomDetail:", roomDetail)
                          
                          // Load room detail trước nếu chưa có
                          if (!roomDetail || roomDetail.idPhong !== roomId) {
                            console.log("[RoomDetailPage] Cần load roomDetail cho roomId:", roomId)
                            await handleOpenRoom(roomId)
                          } else {
                            console.log("[RoomDetailPage] Đã có roomDetail cho roomId:", roomId)
                          }
                          
                          // Sau đó mở modal booking
                          setOpenRoomId(roomId)
                          setBookingOpen(true)
                        }
                      }}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Đặt phòng này
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12"
                      onClick={() => router.push("/rooms")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại danh sách
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <div>✓ Miễn phí hủy phòng</div>
                    <div>✓ Thanh toán tại khách sạn</div>
                    <div>✓ Hỗ trợ 24/7</div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                    <Info className="w-5 h-5" />
                    Thông tin bổ sung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Shield className="w-4 h-4" />
                    <span>An toàn & Vệ sinh</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Clock className="w-4 h-4" />
                    <span>Check-in: 14:00 | Check-out: 12:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Wifi className="w-4 h-4" />
                    <span>WiFi miễn phí tốc độ cao</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Room detail dialog */}
      <Dialog open={openRoomId != null} onOpenChange={(o) => {
        console.log("[RoomDetailPage] Dialog onOpenChange:", o, "openRoomId:", openRoomId, "roomDetail:", roomDetail)
        if (!o) {
          setOpenRoomId(null)
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết phòng {roomDetail?.tenPhong || (openRoomId ? `#${openRoomId}` : "")}</DialogTitle>
          </DialogHeader>
          {roomDetailLoading ? (
            <div className="text-sm text-muted-foreground">Đang tải chi tiết phòng...</div>
          ) : roomDetail ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-sm"><span className="text-muted-foreground">Tên phòng:</span> <span className="font-medium">{roomDetail.tenPhong}</span></div>
                  <div className="text-sm"><span className="text-muted-foreground">Trạng thái:</span> <span className="font-medium">{roomDetail.trangThai}</span></div>
                  <div className="text-sm"><span className="text-muted-foreground">Tầng:</span> <span className="font-medium">{roomDetail.idTang}</span></div>
                  <div className="text-sm"><span className="text-muted-foreground">Đơn vị:</span> <span className="font-medium">{roomDetail.idDvi}</span></div>
                </div>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={toAbsolute(roomDetail.anhPhong) || roomTypeImage || "/placeholder.svg?height=400&width=600"} 
                    alt={roomDetail.tenPhong} 
                    className="w-full h-56 object-cover rounded-lg border"
                    onError={(e) => {
                      console.warn("Image failed to load:", e.currentTarget.src)
                      e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                    }}
                  />
                </div>
              </div>

              <RoomDevicesList roomId={String(roomDetail.idPhong)} ptbList={(roomDetail as any)?.danhSachThietBi} debug />

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setOpenRoomId(null)}>Đóng</Button>
                <Button onClick={() => { setBookingOpen(true) }}>Đặt phòng này</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Không có dữ liệu phòng.</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <BookingModal 
        open={bookingOpen} 
        onOpenChange={(open) => {
          console.log("[RoomDetailPage] BookingModal onOpenChange:", open, "roomId:", openRoomId, "roomDetail:", roomDetail)
          setBookingOpen(open)
          // Khi tắt modal booking thì cũng đóng modal chi tiết phòng
          if (!open) {
            setOpenRoomId(null)
          }
        }} 
        roomId={openRoomId} 
      />
    </main>
  )
}
