"use client"

import AdminLayout from "../layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import * as tbApi from "@/lib/thietbi-api"
import { toast } from "sonner"

export default function AdminDevicesPage() {
  const [refresh, setRefresh] = useState(0)
  const [devices, setDevices] = useState<tbApi.ThietBiDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const ds = await tbApi.getAllThietBi()
        if (mounted) {
          setDevices(ds)
        }
      } catch (error) {
        console.error("Error loading devices:", error)
        if (mounted) {
          setDevices([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [refresh])

  return (
    <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Thiết bị</CardTitle>
              <CardDescription>Quản lý danh mục thiết bị dùng cho phòng</CardDescription>
            </div>
            <CardAction>
              <CreateDevice
                devices={devices}
                onSubmit={async (data) => {
                  try {
                    await tbApi.createThietBi({ tenTb: data.name.trim(), moTa: data.description?.trim() })
                    setRefresh((x) => x + 1)
                    toast.success("Đã thêm thiết bị")
                  } catch (e: any) {
                    toast.error(e?.message || "Thêm thiết bị thất bại")
                  }
                }}
              />
            </CardAction>
          </div>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="w-40 text-right pr-4">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((d) => (
                  <TableRow key={d.idTb}>
                    <TableCell>{d.tenTb}</TableCell>
                    <TableCell>{d.moTa || "-"}</TableCell>
                    <TableCell className="space-x-2 text-right pr-4">
                      <InlineEditDevice
                        device={d}
                        devices={devices}
                        onSubmit={async (patch) => {
                          try {
                            await tbApi.updateThietBi(d.idTb!, { tenTb: patch.name.trim(), moTa: patch.description?.trim() })
                            setRefresh((x) => x + 1)
                            toast.success("Đã lưu thiết bị")
                          } catch (e: any) {
                            toast.error(e?.message || "Lưu thiết bị thất bại")
                          }
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!confirm(`Xóa thiết bị \"${d.tenTb}\"?`)) return
                          try {
                            await tbApi.deleteThietBi(d.idTb!)
                            setRefresh((x) => x + 1)
                            toast.success("Đã xóa thiết bị")
                          } catch (e: any) {
                            toast.error(e?.message || "Xóa thiết bị thất bại")
                          }
                        }}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      Chưa có thiết bị.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
  )
}

function CreateDevice({ devices, onSubmit }: { devices: tbApi.ThietBiDTO[]; onSubmit: (data: { name: string; description?: string }) => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  function validate(): boolean {
    const newErrors: { name?: string; description?: string } = {}
    const trimmed = name.trim()
    if (!trimmed) newErrors.name = "Vui lòng nhập tên thiết bị"
    else if (trimmed.length < 2) newErrors.name = "Tên ít nhất 2 ký tự"
    else if (trimmed.length > 100) newErrors.name = "Tên tối đa 100 ký tự"
    const exists = devices.some((x) => (x.tenTb || "").trim().toLowerCase() === trimmed.toLowerCase())
    if (!newErrors.name && exists) newErrors.name = "Tên thiết bị đã tồn tại"
    const desc = (description || "").trim()
    if (!desc) newErrors.description = "Vui lòng nhập mô tả"
    else if (desc.length > 255) newErrors.description = "Mô tả tối đa 255 ký tự"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="flex gap-2">
      <Input className="w-48" placeholder="Tên thiết bị" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        className="w-64"
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
      {errors.description && <span className="text-sm text-red-500">{errors.description}</span>}
      <Button
        onClick={() => {
          if (!validate()) return
          onSubmit({ name: name.trim(), description: description.trim() })
          setName("")
          setDescription("")
          setErrors({})
        }}
      >
        Thêm
      </Button>
    </div>
  )
}

function InlineEditDevice({
  device,
  devices,
  onSubmit,
}: {
  device: tbApi.ThietBiDTO
  devices: tbApi.ThietBiDTO[]
  onSubmit: (patch: { name: string; description?: string }) => void
}) {
  const [name, setName] = useState(device.tenTb)
  const [description, setDescription] = useState(device.moTa ?? "")
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  function validate(): boolean {
    const newErrors: { name?: string; description?: string } = {}
    const trimmed = (name || "").trim()
    if (!trimmed) newErrors.name = "Vui lòng nhập tên thiết bị"
    else if (trimmed.length < 2) newErrors.name = "Tên ít nhất 2 ký tự"
    else if (trimmed.length > 100) newErrors.name = "Tên tối đa 100 ký tự"
    const exists = devices.some((x) => x.idTb !== device.idTb && (x.tenTb || "").trim().toLowerCase() === trimmed.toLowerCase())
    if (!newErrors.name && exists) newErrors.name = "Tên thiết bị đã tồn tại"
    const desc = (description || "").trim()
    if (!desc) newErrors.description = "Vui lòng nhập mô tả"
    else if (desc.length > 255) newErrors.description = "Mô tả tối đa 255 ký tự"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  return (
    <div className="inline-flex gap-2">
      <Input className="w-40" value={name} onChange={(e) => setName(e.target.value)} />
      <Input className="w-48" value={description} onChange={(e) => setDescription(e.target.value)} />
      {errors.name && <span className="text-sm text-red-500 self-center">{errors.name}</span>}
      {errors.description && <span className="text-sm text-red-500 self-center">{errors.description}</span>}
      <Button size="sm" variant="outline" onClick={() => {
        if (!validate()) return
        onSubmit({ name: name.trim(), description: description.trim() })
      }}>
        Lưu
      </Button>
    </div>
  )
}
