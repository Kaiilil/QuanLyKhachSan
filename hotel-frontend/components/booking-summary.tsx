"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RoomType } from "@/lib/types"
import { formatCurrencyVND } from "@/lib/format"

export default function BookingSummary(props: {
  room: RoomType
  nights: number
  quantity: number
  total: number
}) {
  const { room, nights, quantity, total } = props
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tóm tắt</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex justify-between">
          <span>Loại phòng</span>
          <span>{room.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Đơn giá</span>
          <span>{formatCurrencyVND(room.price)}/đêm</span>
        </div>
        <div className="flex justify-between">
          <span>Số đêm</span>
          <span>{nights}</span>
        </div>
        <div className="flex justify-between">
          <span>Số phòng</span>
          <span>{quantity}</span>
        </div>
        <div className="flex justify-between font-medium text-foreground">
          <span>Tổng</span>
          <span>{formatCurrencyVND(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
