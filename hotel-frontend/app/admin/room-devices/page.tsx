"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import {
  getAllPhongThietBi,
  updatePhongThietBi,
  deletePhongThietBi,
  createPhongThietBi,
  type PhongThietBiDTO,
  getPhongThietBiByPhong,
  getPhongThietBiByThietBi,
  getPhongThietBiByPhongAndThietBi,
} from "@/lib/phongthietbi-api"
import { getAllPhong, type PhongDTO } from "@/lib/phong-api"
import { getAllThietBi, type ThietBiDTO } from "@/lib/thietbi-api"

export default function RoomDevicesPage() {
  const [roomDevices, setRoomDevices] = useState<PhongThietBiDTO[]>([])
  const [rooms, setRooms] = useState<PhongDTO[]>([])
  const [devices, setDevices] = useState<ThietBiDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedRoomDevice, setSelectedRoomDevice] = useState<PhongThietBiDTO | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    idPhong: "",
    idTb: "",
    soLuong: 1
  })

  const roomNameById = useMemo(() => {
    const m = new Map<number, string>()
    rooms.forEach(r => m.set(r.idPhong, r.tenPhong))
    return m
  }, [rooms])

  const deviceNameById = useMemo(() => {
    const m = new Map<number, string>()
    devices.forEach(d => d.idTb != null && m.set(d.idTb, d.tenTb))
    return m
  }, [devices])

  useEffect(() => {
    loadReferences()
    loadRoomDevices()
  }, [])

  async function loadReferences() {
    try {
      const [rs, ds] = await Promise.all([getAllPhong(), getAllThietBi()])
      setRooms(rs)
      setDevices(ds)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải danh sách phòng/thiết bị: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  async function loadRoomDevices() {
    setLoading(true)
    try {
      const data = await getAllPhongThietBi()
      setRoomDevices(data)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải danh sách thiết bị phòng: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    // Validate
    if (!formData.idPhong || !formData.idTb) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng chọn đầy đủ Phòng và Thiết bị", variant: "destructive" })
      return
    }
    if (Number.isNaN(parseInt(formData.idPhong)) || Number.isNaN(parseInt(formData.idTb))) {
      toast({ title: "Dữ liệu không hợp lệ", description: "Phòng/Thiết bị không đúng định dạng", variant: "destructive" })
      return
    }
    if (!formData.soLuong || formData.soLuong < 1) {
      toast({ title: "Số lượng không hợp lệ", description: "Số lượng phải lớn hơn hoặc bằng 1", variant: "destructive" })
      return
    }

    try {
      setSaving(true)
      // Chặn trùng (đã gán cùng Phòng + Thiết bị)
      const existed = await getPhongThietBiByPhongAndThietBi(parseInt(formData.idPhong), parseInt(formData.idTb))
      if (existed) {
        toast({ title: "Đã tồn tại", description: "Thiết bị này đã được gán cho phòng, vui lòng Sửa số lượng thay vì thêm mới", variant: "destructive" })
        setSaving(false)
        return
      }

      await createPhongThietBi({
        idPhong: parseInt(formData.idPhong),
        idTb: parseInt(formData.idTb),
        soLuong: formData.soLuong
      })
      
      toast({
        title: "Thành công",
        description: "Đã thêm thiết bị vào phòng"
      })
      
      setFormData({ idPhong: "", idTb: "", soLuong: 1 })
      loadRoomDevices()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể thêm thiết bị: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate() {
    if (!selectedRoomDevice) return

    try {
      // Validate số lượng
      if (!formData.soLuong || formData.soLuong < 1) {
        toast({ title: "Số lượng không hợp lệ", description: "Số lượng phải lớn hơn hoặc bằng 1", variant: "destructive" })
        return
      }

      setSaving(true)
      await updatePhongThietBi(selectedRoomDevice.id, { soLuong: formData.soLuong })
      
      toast({ title: "Thành công", description: "Đã cập nhật số lượng thiết bị" })
      
      setIsEditing(false)
      setSelectedRoomDevice(null)
      setFormData({ idPhong: "", idTb: "", soLuong: 1 })
      loadRoomDevices()
    } catch (error: any) {
      toast({ title: "Lỗi", description: `Không thể cập nhật: ${error.message}`, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa thiết bị này khỏi phòng?")) return

    try {
      await deletePhongThietBi(id)
      toast({ title: "Thành công", description: "Đã xóa thiết bị khỏi phòng" })
      loadRoomDevices()
    } catch (error: any) {
      toast({ title: "Lỗi", description: `Không thể xóa: ${error.message}`, variant: "destructive" })
    }
  }

  function handleEdit(roomDevice: PhongThietBiDTO) {
    setSelectedRoomDevice(roomDevice)
    setFormData({
      idPhong: roomDevice.idPhong != null ? String(roomDevice.idPhong) : "",
      idTb: roomDevice.idTb != null ? String(roomDevice.idTb) : "",
      soLuong: roomDevice.soLuong ?? 1
    })
    setIsEditing(true)
  }

  function handleCancel() {
    setIsEditing(false)
    setSelectedRoomDevice(null)
    setFormData({ idPhong: "", idTb: "", soLuong: 1 })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Thiết bị Phòng</CardTitle>
          <CardDescription>Gán thiết bị cho phòng và cập nhật số lượng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Phòng</Label>
              <Select
                value={formData.idPhong}
                onValueChange={(v) => setFormData({ ...formData, idPhong: v })}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.idPhong} value={String(r.idPhong)}>
                      {r.tenPhong}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Thiết bị</Label>
              <Select
                value={formData.idTb}
                onValueChange={(v) => setFormData({ ...formData, idTb: v })}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thiết bị" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((d) => (
                    <SelectItem key={d.idTb} value={String(d.idTb)}>
                      {d.tenTb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="soLuong">Số lượng</Label>
              <Input
                id="soLuong"
                type="number"
                min="1"
                value={formData.soLuong}
                onChange={(e) => setFormData({ ...formData, soLuong: parseInt(e.target.value) || 1 })}
                placeholder="Số lượng"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleUpdate} disabled={saving || !formData.soLuong || formData.soLuong < 1}>Cập nhật</Button>
                <Button variant="outline" onClick={handleCancel}>Hủy</Button>
              </>
            ) : (
              <Button onClick={handleCreate} disabled={saving || !formData.idPhong || !formData.idTb || !formData.soLuong || formData.soLuong < 1}>Thêm thiết bị vào phòng</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Thiết bị trong Phòng</CardTitle>
          <CardDescription>Toàn bộ thiết bị đã gán theo từng phòng</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead className="text-right pr-4">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{roomNameById.get(device.idPhong) || `Phòng #${device.idPhong}`}</TableCell>
                    <TableCell>{deviceNameById.get(device.idTb) || `Thiết bị #${device.idTb}`}</TableCell>
                    <TableCell>{device.soLuong}</TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(device)}>
                          Sửa
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(device.id)}>
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {roomDevices.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">Chưa có thiết bị nào trong phòng</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
