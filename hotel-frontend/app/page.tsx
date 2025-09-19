"use client"

import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Star, MapPin, Clock, Shield, Wifi, Car, UtensilsCrossed } from "lucide-react"
import { getAllLoaiPhong, type LoaiPhong } from "@/lib/loai-phong-api"
import type { RoomType } from "@/lib/types"

export default function HomePage() {
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const data: LoaiPhong[] = await getAllLoaiPhong()
        
        // Map LoaiPhong -> RoomType (giống như trang rooms/page.tsx)
        const mapped: RoomType[] = data.map(lp => ({
          id: String(lp.idLoaiPhong),
          name: lp.tenLoaiPhong,
          price: lp.gia,
          description: lp.moTa || "",
          amenities: [],
          images: (() => {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
              const toAbsolute = (p?: string): string | undefined => {
    if (!p) return undefined
    if (p.startsWith("http")) return p
    if (p.startsWith("/uploads/")) return apiBase + p
    if (p.startsWith("uploads/")) return apiBase + "/" + p
    if (p.startsWith("/rooms/")) return apiBase + "/uploads" + p
    if (p.startsWith("rooms/")) return apiBase + "/uploads/" + p
         // Nếu là filename đơn giản (không có path), thử static path
     if (!p.includes("/") && !p.includes("\\")) {
       return `${apiBase}/uploads/rooms/${p}`
     }
    return apiBase + p
  }
            const p = lp.hinhAnh || lp.anhphong || undefined
            const abs = toAbsolute(p)
            return abs ? [abs] : []
          })(),
          capacity: 2,
          sizeM2: 20,
          view: "Không rõ",
          devices: [],
        }))
        
        if (mounted) setRooms(mapped)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Không thể tải dữ liệu loại phòng"))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
                  ✨ Khách sạn đẳng cấp 5 sao
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Trải nghiệm nghỉ dưỡng
                  <span className="block text-blue-600">sang trọng</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Khám phá sự hoàn hảo trong từng chi tiết. Dịch vụ tận tâm, tiện nghi hiện đại, 
                  và những khoảnh khắc đáng nhớ đang chờ đón bạn.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-6 text-lg font-semibold rounded-xl">
                  <Link href="/booking">Đặt phòng ngay</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300">
                  <Link href="/rooms">Xem loại phòng</Link>
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm">An toàn tuyệt đối</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">WiFi miễn phí</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Car className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Bãi đỗ xe</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">Nhà hàng 24/7</span>
                </div>
              </div>
            </div>

            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 h-[600px]">
                <div className="space-y-4">
                  <Card className="overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <CardContent className="p-0">
                      <img
                        src="/nhung-trai-nghiem-chi-co-o-khach-san-5-sao-1.jpg"
                        alt="Sảnh khách sạn sang trọng"
                        className="w-full h-80 object-cover"
                      />
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <CardContent className="p-0">
                      <img
                        src="/indochine-palace-342222.jpg"
                        alt="Phòng nghỉ cao cấp"
                        className="w-full h-40 object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <CardContent className="p-0">
                      <img
                        src="/okinawa-churaumi-aquarium10-minutes-by-car-hotel-4-selections-015_R.jpg"
                        alt="Bể bơi ngoài trời"
                        className="w-full h-40 object-cover"
                      />
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <CardContent className="p-0">
                      <img
                        src="/505021686.jpg"
                        alt="Nhà hàng sang trọng"
                        className="w-full h-80 object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">5.0</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Đánh giá từ khách hàng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-blue-600 border-blue-200 bg-blue-50">
            🏨 Loại phòng
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn phòng phù hợp với bạn
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Từ phòng đơn tiện nghi đến suite cao cấp, chúng tôi có đầy đủ các lựa chọn 
            để đáp ứng mọi nhu cầu của bạn.
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <div className="text-red-600 text-lg font-medium mb-2">⚠️ Không thể tải dữ liệu</div>
              <div className="text-red-500 text-sm">{error.message}</div>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
              >
                Thử lại
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <Card 
                key={room.id} 
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 bg-white cursor-pointer"
                onClick={() => window.location.href = `/rooms/${room.id}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={room.images?.[0] || "/placeholder.jpg"}
                    alt={room.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-blue-600 text-white border-0 shadow-lg">
                      {room.price?.toLocaleString()} VND
                    </Badge>
                  </div>
                  
                  {/* Room Type Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800 border-0 font-medium">
                      {room.name}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>Vị trí đắc địa</span>
                      <span className="text-gray-300">•</span>
                      <span>Tiện nghi đầy đủ</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {room.description || "Phòng được thiết kế hiện đại với đầy đủ tiện nghi, mang đến trải nghiệm nghỉ dưỡng tuyệt vời cho quý khách."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">4.8</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Đánh giá cao</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-4 py-2"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Sẵn sàng cho kỳ nghỉ hoàn hảo?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Đặt phòng ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                <Link href="/booking">Đặt phòng ngay</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                <Link href="/rooms">Xem tất cả loại phòng</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
