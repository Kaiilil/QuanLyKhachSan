"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Tv, 
  Wifi, 
  Snowflake, 
  Bath, 
  Bed, 
  Coffee, 
  Car, 
  Users,
  Square,
  Eye,
  Star
} from "lucide-react"
import { getPhongThietBiByPhong } from "@/lib/phongthietbi-api"
import { getPhongDetailById } from "@/lib/phong-api"
import { getThietBiById } from "@/lib/thietbi-api"

export type RoomDevice = {
  id: number
  name: string
  description?: string
  quantity: number
}

type RoomDevicesListProps = {
  roomId: string | number
  className?: string
  debug?: boolean
  ptbList?: Array<{ id: number; idTb: number; soLuong: number }>
}

export default function RoomDevicesList({ roomId, className = "", debug = false, ptbList }: RoomDevicesListProps) {
  const [devices, setDevices] = useState<RoomDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDevices = async () => {
      if (!roomId && roomId !== 0) return
      
      try {
        setLoading(true)
        setError(null)
        const idPhong = Number(roomId)
        if (Number.isNaN(idPhong)) {
          setDevices([])
          setError("roomId không hợp lệ")
          return
        }
        if (debug) console.log("[RoomDevicesList] Fetching devices for roomId:", idPhong)
        
        // Lấy danh sách thiết bị trong phòng
        let phongThietBi = ptbList && ptbList.length > 0
          ? ptbList
          : await getPhongThietBiByPhong(idPhong)
        if (debug) console.log("[RoomDevicesList] phongThietBi:", phongThietBi)

        // Fallback: nếu API trên trả rỗng, thử lấy từ API chi tiết phòng
        if (!phongThietBi || phongThietBi.length === 0) {
          const detail = await getPhongDetailById(idPhong).catch(() => null as any)
          if (debug) console.log("[RoomDevicesList] fallback room detail:", detail)
          if (detail && Array.isArray(detail.danhSachThietBi) && detail.danhSachThietBi.length > 0) {
            phongThietBi = detail.danhSachThietBi
          }
        }
        
        // Lấy thông tin chi tiết của từng thiết bị
        const deviceDetails = await Promise.all(
          phongThietBi.map(async (ptb) => {
            try {
              const thietBi = await getThietBiById(ptb.idTb)
              if (debug) console.log(`[RoomDevicesList] device ${ptb.idTb}:`, thietBi)
              return {
                id: ptb.id,
                name: thietBi.tenTb,
                description: thietBi.moTa,
                quantity: ptb.soLuong
              }
            } catch (e) {
              console.error(`Lỗi khi lấy thông tin thiết bị ${ptb.idTb}:`, e)
              return {
                id: ptb.id,
                name: `Thiết bị ${ptb.idTb}`,
                description: "Không có mô tả",
                quantity: ptb.soLuong
              }
            }
          })
        )
        
        setDevices(deviceDetails)
      } catch (e) {
        console.error("Lỗi khi tải thiết bị:", e)
        setError("Không thể tải danh sách thiết bị")
      } finally {
        setLoading(false)
      }
    }

    loadDevices()
  }, [roomId, debug])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Tv className="w-5 h-5 text-blue-500" />
            Thiết bị
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="w-12 h-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${className} border-red-200 bg-red-50`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-red-600">
            <Tv className="w-5 h-5" />
            Thiết bị
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-sm">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (devices.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Tv className="w-5 h-5 text-blue-500" />
            Thiết bị
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm text-center py-4">
            Không có thiết bị nào được cài đặt trong phòng này
          </div>
        </CardContent>
      </Card>
    )
  }

  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName.toLowerCase()
    if (name.includes('tv') || name.includes('tivi')) return <Tv className="w-5 h-5 text-blue-600" />
    if (name.includes('wifi') || name.includes('internet')) return <Wifi className="w-5 h-5 text-green-600" />
    if (name.includes('điều hòa') || name.includes('ac') || name.includes('air')) return <Snowflake className="w-5 h-5 text-blue-500" />
    if (name.includes('bồn tắm') || name.includes('vòi sen')) return <Bath className="w-5 h-5 text-blue-400" />
    if (name.includes('giường') || name.includes('bed')) return <Bed className="w-5 h-5 text-orange-600" />
    if (name.includes('cà phê') || name.includes('trà')) return <Coffee className="w-5 h-5 text-brown-600" />
    if (name.includes('xe') || name.includes('car')) return <Car className="w-5 h-5 text-gray-600" />
    return <Tv className="w-5 h-5 text-gray-600" />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Tv className="w-5 h-5 text-blue-500" />
          Thiết bị ({devices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex-shrink-0 mt-1">
                {getDeviceIcon(device.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {device.name}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {device.quantity} cái
                  </Badge>
                </div>
                {device.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {device.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
