"use client"

import React, { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/site-header";
import { getAllLoaiPhong, LoaiPhong } from "@/lib/loai-phong-api"
import RoomCard from "@/components/room-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrencyVND } from "@/lib/format"
import type { RoomType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Search } from "lucide-react"

const ALL_AMENITIES = ["Wifi miễn phí", "Bữa sáng", "Bể bơi", "Spa", "Phòng gym", "Chỗ đậu xe"]

export default function RoomsPage() {
  const [query, setQuery] = useState("")
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [capacity, setCapacity] = useState<number | undefined>(undefined)
  const [amenities, setAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "name_asc">("price_asc")

  const [rooms, setRooms] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data: LoaiPhong[] = await getAllLoaiPhong()
        // Map LoaiPhong -> RoomType (giả sử RoomType có các trường: id, name, price, description, amenities, images, ...)
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
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const maxRoomPrice = useMemo(() => {
    if (!rooms.length) return 0
    return Math.max(...rooms.map((r) => r.price))
  }, [rooms])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return rooms.filter((r) => {
      if (q && !(`${r.name} ${r.description}`.toLowerCase().includes(q))) return false
      if (maxPrice != null && r.price > maxPrice) return false
      if (capacity != null && r.capacity < capacity) return false
      if (amenities.length) {
        const hasAll = amenities.every((a) => r.amenities.includes(a))
        if (!hasAll) return false
      }
      return true
    })
  }, [rooms, query, maxPrice, capacity, amenities])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price)
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price)
    else if (sortBy === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [filtered, sortBy])

  function resetFilters() {
    setQuery("")
    setMaxPrice(undefined)
    setCapacity(undefined)
    setAmenities([])
    setSortBy("price_asc")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animated-gradient-bg">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <Badge className="mb-3 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow">
            <Filter className="w-4 h-4 mr-1 inline" /> Khám phá phòng
          </Badge>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Chọn loại phòng phù hợp</h1>
          <p className="text-gray-600 mt-2">Lọc theo nhu cầu của bạn để tìm phòng ưng ý nhất.</p>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <aside className="space-y-6">
            <div className="sticky top-24 rounded-2xl border border-blue-100 bg-white/90 backdrop-blur-sm shadow-lg p-5 card-hover">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-full mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Bộ lọc</h2>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={resetFilters}>Xóa lọc</Button>
              </div>

              <div className="space-y-2 mb-4">
                <Label>Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="Tên loại phòng..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <Label>Giá tối đa</Label>
                <div className="text-sm text-gray-600">{maxPrice ? formatCurrencyVND(maxPrice) : "Không giới hạn"}</div>
                {maxRoomPrice > 0 ? (
                  <Slider
                    defaultValue={[maxRoomPrice]}
                    max={maxRoomPrice}
                    step={50_000}
                    onValueChange={(v) => setMaxPrice(v[0])}
                  />
                ) : (
                  <div className="h-4 bg-gray-100 rounded" />
                )}
              </div>

             

             
            </div>
          </aside>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Các loại phòng</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{sorted.length} kết quả</span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_asc">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price_desc">Giá cao đến thấp</SelectItem>
                    <SelectItem value="name_asc">Theo tên (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="h-48 bg-gray-200 rounded-xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sorted.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
                {sorted.length === 0 ? (
                  <p className="text-muted-foreground mt-6">Không tìm thấy phòng phù hợp.</p>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
