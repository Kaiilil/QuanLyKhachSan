"use client"

import AdminLayout from "../layout"
import {
  getPhysicalRooms,
  createPhysicalRoom,
  updatePhysicalRoomStatus,
  deletePhysicalRoom,
  getFloors,
  getUnits,
  updateAllRoomStatus,
  updateRoomStatus,
  getRoomStatusCounts,
} from "@/lib/admin-db"
import { getAllLoaiPhong } from "@/lib/loai-phong-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { Input as FileInput } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function AdminRoomsPage() {
  const [refresh, setRefresh] = useState(0)
  const [rooms, setRooms] = useState<import("@/lib/admin-db").PhysicalRoom[]>([])
  const [floors, setFloors] = useState<{ id: string; name: string; unitId: string }[]>([])
  const [units, setUnits] = useState<{ id: string; name: string }[]>([])
  const [roomTypes, setRoomTypes] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const [rs, fs, us, rts] = await Promise.all([
          getPhysicalRooms(),
          getFloors(),
          getUnits(),
          getAllLoaiPhong()
        ])
        if (mounted) {
          setRooms(rs)
          setFloors(fs)
          setUnits(us)
          setRoomTypes(rts.map((r) => ({ id: String(r.idLoaiPhong), name: r.tenLoaiPhong })))
        }
      } catch (error) {
        console.error("Error loading data:", error)
        if (mounted) {
          setRooms([])
          setFloors([])
          setUnits([])
          setRoomTypes([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [refresh])

  const floorMap = useMemo(() => Object.fromEntries(floors.map((f) => [f.id, f.name])), [floors])
  const unitMap = useMemo(() => Object.fromEntries(units.map((u) => [u.id, u.name])), [units])
  const rtMap = useMemo(
    () => Object.fromEntries((roomTypes || []).map((r) => [r.id, r.name])),
    [roomTypes],
  )

  const handleUpdateAllRoomStatus = async () => {
    setUpdatingStatus(true)
    try {
      const success = await updateAllRoomStatus()
      if (success) {
        setRefresh((x) => x + 1)
        toast.success("✅ Đã cập nhật trạng thái tất cả phòng dựa trên thời gian thực")
      } else {
        toast.error("❌ Cập nhật trạng thái thất bại")
      }
    } catch (error) {
      toast.error("❌ Lỗi khi cập nhật trạng thái")
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle>Phòng</CardTitle>
             
            </div>
            <Button 
              onClick={handleUpdateAllRoomStatus}
              disabled={updatingStatus}
              variant="outline"
              size="sm"
            >
              {updatingStatus ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Đang cập nhật...
                </>
              ) : (
                "🔄 "
              )}
            </Button>
            <RoomStatusInfo />
          </div>
          <CreateRoom
            floors={floors}
            units={units}
            roomTypes={roomTypes}
            existingNames={rooms.map((r) => (r.name || "").trim().replace(/\s+/g, " ").toLowerCase())}
            onSubmit={async (data) => {
              try {
                await createPhysicalRoom(data)
                setRefresh((x) => x + 1)
                toast.success(`✅ Đã tạo phòng ${data.name} thành công`)
              } catch (error: any) {
                toast.error(error?.message || "Tạo phòng thất bại")
              }
            }}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Đang tải...
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Tầng</TableHead>
                  <TableHead>Loại phòng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-56 text-right pr-4">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((r) => {
                  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
                  const imgUrl = r.imagePath
                    ? r.imagePath.startsWith("http")
                      ? r.imagePath
                      : r.imagePath.startsWith("/uploads/")
                        ? apiBase + r.imagePath
                        : apiBase + "/uploads" + (r.imagePath.startsWith("/") ? r.imagePath : "/" + r.imagePath)
                    : undefined
                  return (
                  <TableRow key={r.id}>
                    <TableCell>
                      {imgUrl ? (
                        <img src={imgUrl} alt="Ảnh phòng" className="h-12 w-20 object-cover border" />
                      ) : (
                        <span className="text-muted-foreground">Không ảnh</span>
                      )}
                    </TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{unitMap[r.unitId]}</TableCell>
                    <TableCell>{floorMap[r.floorId]}</TableCell>
                    <TableCell>{rtMap[r.roomTypeId]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            r.status === "Trống"
                              ? "secondary"
                              : r.status === "Đang sử dụng"
                                ? "default"
                                : "outline"
                          }
                        >
                          {r.status}
                        </Badge>
                        <StatusChangeButton 
                          roomId={r.id} 
                          currentStatus={r.status}
                          onStatusChange={(newStatus) => {
                            setRefresh((x) => x + 1)
                            toast.success(`✅ Đã cập nhật trạng thái phòng ${r.name} thành: ${newStatus}`)
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            try {
                              const success = await updateRoomStatus(Number(r.id))
                              if (success) {
                                setRefresh((x) => x + 1)
                                toast.success(`✅ Đã cập nhật trạng thái phòng ${r.name} dựa trên thời gian thực`)
                              } else {
                                toast.error(`❌ Cập nhật trạng thái phòng ${r.name} thất bại`)
                              }
                            } catch (error) {
                              toast.error(`❌ Lỗi khi cập nhật trạng thái phòng ${r.name}`)
                            }
                          }}
                          title="Cập nhật trạng thái dựa trên thời gian thực"
                        >
                          🔄
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="space-x-2 text-right pr-4">
                      <InlineEditRoom
                        room={r}
                        floors={floors}
                        units={units}
                        roomTypes={roomTypes}
                        onSubmit={async (patch) => {
                          try {
                            // Nếu chỉ thay đổi trạng thái, sử dụng API riêng
                            if (patch.status && Object.keys(patch).length === 1) {
                              await updatePhysicalRoomStatus(r.id, patch.status)
                            } else {
                              // Nếu thay đổi nhiều thông tin, sử dụng API update đầy đủ
                              const { imageFile, ...rest } = patch
                              let imagePath: string | undefined = r.imagePath
                              if (imageFile) {
                                // Reuse room create API to upload new image by creating a dummy update: create endpoint requires file only for create.
                                const form = new FormData()
                                form.append("file", imageFile)
                                const base = process.env.NEXT_PUBLIC_API_BASE_URL || ""
                                const res = await fetch(`${base}/api/upload/room-image`, { method: "POST", body: form })
                                if (!res.ok) throw new Error("Upload ảnh thất bại")
                                const raw = await res.text()
                                imagePath = raw.startsWith("/uploads/") ? raw : raw.startsWith("/rooms/") ? "/uploads" + raw : raw
                              }
                              
                              // Chỉ gửi các trường có giá trị hợp lệ
                              const updateData: any = {}
                              if (rest.name && rest.name.trim() !== "") {
                                updateData.name = rest.name.trim()
                              }
                              if (rest.unitId && rest.unitId !== "") {
                                updateData.unitId = rest.unitId
                              }
                              if (rest.floorId && rest.floorId !== "") {
                                updateData.floorId = rest.floorId
                              }
                              if (rest.roomTypeId && rest.roomTypeId !== "") {
                                updateData.roomTypeId = rest.roomTypeId
                              }
                              if (rest.status) {
                                updateData.status = rest.status
                              }
                              if (imagePath) {
                                updateData.imagePath = imagePath
                              }
                              
                              await (await import("@/lib/admin-db")).updatePhysicalRoom(r.id, updateData)
                            }
                            setRefresh((x) => x + 1)
                            toast.success(`✅ Đã cập nhật thông tin phòng ${r.name} thành công`)
                          } catch (e: any) {
                            toast.error(e?.message || "Lưu phòng thất bại")
                          }
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            await deletePhysicalRoom(r.id)
                            setRefresh((x) => x + 1)
                            toast.success(`🗑️ Đã xóa phòng ${r.name} thành công`)
                          } catch (e: any) {
                            toast.error(e?.message || "Xóa phòng thất bại")
                          }
                        }}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                )})}
                {rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Chưa có phòng.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
  )
}

function CreateRoom({
  floors,
  units,
  roomTypes,
  existingNames,
  onSubmit,
}: {
  floors: { id: string; name: string; unitId: string }[]
  units: { id: string; name: string }[]
  roomTypes: { id: string; name: string }[]
  existingNames: string[]
  onSubmit: (data: {
    name: string
    floorId: string
    roomTypeId: string
    unitId: string
    status: "Trống" | "Đang sử dụng" | "Bảo trì"
    imageFile?: File
  }) => void
}) {
  const [name, setName] = useState("P101")
  const [unitId, setUnitId] = useState(units[0]?.id ?? "")
  const floorsByUnit = floors.filter((f) => f.unitId === unitId)
  const [floorId, setFloorId] = useState(floorsByUnit[0]?.id ?? "")
  const [roomTypeId, setRoomTypeId] = useState(roomTypes[0]?.id ?? "")
  const [status, setStatus] = useState<"Trống" | "Đang sử dụng" | "Bảo trì">("Trống")
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  
  // Validation states
  const [errors, setErrors] = useState<{
    name?: string
    unitId?: string
    floorId?: string
    roomTypeId?: string
    imageFile?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập tên phòng"
    }
    // Check duplicate name (case-insensitive, whitespace-normalized)
    const normalized = name.trim().replace(/\s+/g, " ").toLowerCase()
    if (!newErrors.name && existingNames.includes(normalized)) {
      newErrors.name = "Tên phòng đã tồn tại"
    }
    if (!unitId) {
      newErrors.unitId = "Vui lòng chọn đơn vị"
    }
    if (!floorId) {
      newErrors.floorId = "Vui lòng chọn tầng"
    }
    if (!roomTypeId) {
      newErrors.roomTypeId = "Vui lòng chọn loại phòng"
    }
    if (!imageFile) {
      newErrors.imageFile = "Vui lòng chọn ảnh phòng"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ 
        name: name.trim(), 
        unitId: String(Number(unitId||"")), 
        floorId: String(Number(floorId||"")), 
        roomTypeId: String(Number(roomTypeId||"")), 
        status, 
        imageFile 
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="space-y-1">
          <Input 
            className={`w-28 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Tên phòng" 
            value={name} 
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
            }} 
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        
        <div className="space-y-1">
          <Select 
            value={unitId || undefined} 
            onValueChange={(v) => {
              setUnitId(v)
              if (errors.unitId) setErrors(prev => ({ ...prev, unitId: undefined }))
            }}
          >
            <SelectTrigger className={`w-40 ${errors.unitId ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Đơn vị" />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unitId && <p className="text-xs text-red-500">{errors.unitId}</p>}
        </div>
        
        <div className="space-y-1">
          <Select 
            value={floorId || undefined} 
            onValueChange={(v) => {
              setFloorId(v)
              if (errors.floorId) setErrors(prev => ({ ...prev, floorId: undefined }))
            }}
          >
            <SelectTrigger className={`w-40 ${errors.floorId ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Tầng" />
            </SelectTrigger>
            <SelectContent>
              {floorsByUnit.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.floorId && <p className="text-xs text-red-500">{errors.floorId}</p>}
        </div>
        
        <div className="space-y-1">
          <Select 
            value={roomTypeId || undefined} 
            onValueChange={(v) => {
              setRoomTypeId(v)
              if (errors.roomTypeId) setErrors(prev => ({ ...prev, roomTypeId: undefined }))
            }}
          >
            <SelectTrigger className={`w-40 ${errors.roomTypeId ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Loại phòng" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.length ? (
                roomTypes.map((rt) => (
                  <SelectItem key={rt.id} value={rt.id}>
                    {rt.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-muted-foreground">Chưa có loại phòng</div>
              )}
            </SelectContent>
          </Select>
          {errors.roomTypeId && <p className="text-xs text-red-500">{errors.roomTypeId}</p>}
        </div>
        
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {["Trống", "Đang sử dụng", "Bảo trì"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="space-y-1">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              setImageFile(e.target.files?.[0] || undefined)
              if (errors.imageFile) setErrors(prev => ({ ...prev, imageFile: undefined }))
            }} 
          />
          {errors.imageFile && <p className="text-xs text-red-500">{errors.imageFile}</p>}
        </div>
        
        <Button onClick={handleSubmit}>Thêm</Button>
      </div>
    </div>
  )
}

function InlineEditRoom({
  room,
  floors,
  units,
  roomTypes,
  onSubmit,
}: {
  room: import("@/lib/admin-db").PhysicalRoom
  floors: { id: string; name: string; unitId: string }[]
  units: { id: string; name: string }[]
  roomTypes: { id: string; name: string }[]
  onSubmit: (patch: Partial<import("@/lib/admin-db").PhysicalRoom> & { imageFile?: File }) => void
}) {
  const [name, setName] = useState(room.name || "")
  const [unitId, setUnitId] = useState(room.unitId || "")
  const floorsByUnit = floors.filter((f) => f.unitId === unitId)
  const [floorId, setFloorId] = useState(room.floorId || "")
  const [roomTypeId, setRoomTypeId] = useState(room.roomTypeId || "")
  const [status, setStatus] = useState(room.status || "Trống")
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  
  // Validation states
  const [errors, setErrors] = useState<{
    name?: string
    unitId?: string
    floorId?: string
    roomTypeId?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập tên phòng"
    }
    if (!unitId) {
      newErrors.unitId = "Vui lòng chọn đơn vị"
    }
    if (!floorId) {
      newErrors.floorId = "Vui lòng chọn tầng"
    }
    if (!roomTypeId) {
      newErrors.roomTypeId = "Vui lòng chọn loại phòng"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ 
        name: name.trim(), 
        unitId: String(Number(unitId||"")), 
        floorId: String(Number(floorId||"")), 
        roomTypeId: String(Number(roomTypeId||"")), 
        status, 
        imageFile 
      })
    }
  }

  return (
    <div className="inline-flex gap-2">
      <div className="space-y-1">
        <Input 
          className={`w-28 ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Tên phòng" 
          value={name} 
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
          }} 
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-1">
        <Select 
          value={unitId} 
          onValueChange={(v) => {
            setUnitId(v)
            if (errors.unitId) setErrors(prev => ({ ...prev, unitId: undefined }))
          }}
        >
          <SelectTrigger className={`w-32 ${errors.unitId ? 'border-red-500' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unitId && <p className="text-xs text-red-500">{errors.unitId}</p>}
      </div>
      
      <div className="space-y-1">
        <Select 
          value={floorId} 
          onValueChange={(v) => {
            setFloorId(v)
            if (errors.floorId) setErrors(prev => ({ ...prev, floorId: undefined }))
          }}
        >
          <SelectTrigger className={`w-32 ${errors.floorId ? 'border-red-500' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {floorsByUnit.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.floorId && <p className="text-xs text-red-500">{errors.floorId}</p>}
      </div>
      
      <div className="space-y-1">
        <Select 
          value={roomTypeId} 
          onValueChange={(v) => {
            setRoomTypeId(v)
            if (errors.roomTypeId) setErrors(prev => ({ ...prev, roomTypeId: undefined }))
          }}
        >
          <SelectTrigger className={`w-36 ${errors.roomTypeId ? 'border-red-500' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.length ? (
              roomTypes.map((rt) => (
                <SelectItem key={rt.id} value={rt.id}>
                  {rt.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-muted-foreground">Chưa có loại phòng</div>
            )}
          </SelectContent>
        </Select>
        {errors.roomTypeId && <p className="text-xs text-red-500">{errors.roomTypeId}</p>}
      </div>
      
      <Select value={status} onValueChange={(v) => setStatus(v as any)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["Trống", "Đang sử dụng", "Bảo trì"].map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setImageFile(e.target.files?.[0] || undefined)} 
      />
      
      <Button size="sm" variant="outline" onClick={handleSubmit}>
        Lưu
      </Button>
    </div>
  )
}

// Component để thay đổi trạng thái phòng
function StatusChangeButton({ 
  roomId, 
  currentStatus, 
  onStatusChange 
}: { 
  roomId: string
  currentStatus: string
  onStatusChange: (newStatus: string) => void 
}) {
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    
    setLoading(true)
    try {
      await updatePhysicalRoomStatus(roomId, newStatus as any)
      onStatusChange(newStatus)
    } catch (error: any) {
      toast.error(error?.message || "Cập nhật trạng thái thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select 
      value={currentStatus} 
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Trống">Trống</SelectItem>
        <SelectItem value="Đang sử dụng">Đang sử dụng</SelectItem>
        <SelectItem value="Bảo trì">Bảo trì</SelectItem>
      </SelectContent>
    </Select>
  )
}

function RoomStatusInfo() {
  const [statusCounts, setStatusCounts] = useState({
    Trống: 0,
    "Đang sử dụng": 0,
    "Bảo trì": 0,
  })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const counts = await getRoomStatusCounts()
        if (mounted) {
          setStatusCounts(counts)
        }
      } catch (error) {
        console.error("Error fetching status counts:", error)
        if (mounted) {
          setStatusCounts({
            Trống: 0,
            "Đang sử dụng": 0,
            "Bảo trì": 0,
          })
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-muted-foreground text-sm">
        <span>Trống: {statusCounts.Trống}</span>
        <span>Đang sử dụng: {statusCounts["Đang sử dụng"]}</span>
        <span>Bảo trì: {statusCounts["Bảo trì"]}</span>
      </div>
    </div>
  )
}
