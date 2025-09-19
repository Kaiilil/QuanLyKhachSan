"use client"
import Link from "next/link"
import type { RoomType } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrencyVND } from "@/lib/format"
import { Users, Ruler, Eye } from "lucide-react"

export default function RoomCard(props: { room: RoomType }) {
  const { room } = props
  const image = room.images[0] ?? "/placeholder.svg?height=600&width=900"
  return (
    <Card className="group overflow-hidden h-full flex flex-col rounded-2xl border border-blue-100/60 bg-white/85 backdrop-blur-sm shadow-lg transition-all duration-300 card-hover">
      <div className="relative aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || "/placeholder.svg"}
          alt={`Ảnh ${room.name}`}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-blue-600 text-white border-0 shadow-md">{formatCurrencyVND(room.price)} / đêm</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          {room.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        <p className="line-clamp-2">
          {room.description || "Phòng được thiết kế hiện đại với đầy đủ tiện nghi."}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{room.capacity} khách</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5 text-purple-600" />
            <span>{room.sizeM2} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-pink-600" />
            <span>{room.view}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <Button variant="outline" className="border-2 hover:border-blue-400 btn-glow" asChild>
          <Link href={`/rooms/${room.id}`}>Xem chi tiết</Link>
        </Button>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-glow" asChild>
          <Link href={`/booking?roomTypeId=${room.id}`}>Đặt ngay</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
