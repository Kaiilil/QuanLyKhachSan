"use client"

import AdminLayout from "../layout"
import { getCompanies, getUnits } from "@/lib/admin-db"
import * as loaiPhongApi from "@/lib/loai-phong-api"
import { useRef, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrencyVND } from "@/lib/format"

export default function AdminRoomTypesPage() {
  const [refresh, setRefresh] = useState(0)
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [units, setUnits] = useState<{ id: string; name: string; companyId: string }[]>([])
  const [roomTypes, setRoomTypes] = useState<loaiPhongApi.LoaiPhong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [form, setForm] = useState<{tenLoaiPhong: string, gia: number, moTa: string, hinhAnh?: string, idLoaiPhong?: number}>({tenLoaiPhong: "", gia: 0, moTa: ""})
  const [editId, setEditId] = useState<number|null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const unitMap = useMemo(() => Object.fromEntries(units.map((u) => [u.id, u.name])), [units])
  const companyMap = useMemo(() => Object.fromEntries(companies.map((c) => [c.id, c.name])), [companies])

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  const toAbsoluteImgUrl = (path?: string): string | undefined => {
    if (!path) return undefined
    if (path.startsWith("http")) return path
    
    // Debug: log để xem đường dẫn gốc
    console.log("Original path:", path)
    
    // Xử lý các trường hợp khác nhau
    if (path.startsWith("/uploads/")) return apiBase + path
    if (path.startsWith("uploads/")) return apiBase + "/" + path
    if (path.startsWith("/rooms/")) return apiBase + "/uploads" + path
    
    // Sử dụng endpoint mới để serve ảnh
    // Nếu path là "rooms/filename.png", chuyển thành "/api/upload/images/rooms/filename.png"
    if (path.startsWith("rooms/")) {
      const finalUrl = apiBase + "/api/upload/images/" + path
      console.log("Final URL (new endpoint):", finalUrl)
      return finalUrl
    }
    
    // Xử lý trường hợp /uploads/rooms/... từ backend
    if (path.startsWith("/uploads/rooms/")) {
      // Thử endpoint mới trước
      const newEndpointUrl = apiBase + "/api/upload/images" + path.replace("/uploads", "")
      console.log("Trying new endpoint:", newEndpointUrl)
      return newEndpointUrl
    }
    
    // Nếu không có prefix, thêm /uploads/ vào trước
    const finalUrl = apiBase + "/uploads/" + path
    console.log("Final URL:", finalUrl)
    return finalUrl
  }

  // Load danh sách loại phòng
  const loadLoaiPhongs = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await loaiPhongApi.getAllLoaiPhong()
      console.log("Room types data:", data) // Debug: xem dữ liệu từ API
      setRoomTypes(data)
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLoaiPhongs() }, [refresh])

  // Upload file ảnh
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/upload/room-image", {
        method: "POST",
        body: formData
      })
      if (!res.ok) throw new Error("Upload ảnh thất bại")
      const rawUrl = await res.text()
      // Chuẩn hóa: backend trả về "/rooms/.." => lưu "/uploads/rooms/.." để hiển thị đúng
      const normalized = rawUrl.startsWith("/uploads/")
        ? rawUrl
        : rawUrl.startsWith("/rooms/")
          ? "/uploads" + rawUrl
          : rawUrl
      setForm(f => ({ ...f, hinhAnh: normalized }))
    } catch (e: any) {
      setError(e)
    } finally {
      setUploading(false)
    }
  }

  // Thêm hoặc cập nhật loại phòng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate bắt buộc
      if (!form.tenLoaiPhong.trim()) throw new Error("Vui lòng nhập tên loại phòng")
      if (!form.gia || form.gia <= 0) throw new Error("Vui lòng nhập giá hợp lệ")
      if (!form.moTa.trim()) throw new Error("Vui lòng nhập mô tả")
      
      // Validate ảnh bắt buộc khi tạo mới
      if (!editId && !form.hinhAnh) {
        throw new Error("Vui lòng chọn ảnh cho loại phòng")
      }

      if (editId) {
        await loaiPhongApi.updateLoaiPhong(editId, form)
      } else {
        await loaiPhongApi.createLoaiPhong(form)
      }
      setForm({tenLoaiPhong: "", gia: 0, moTa: ""})
      setEditId(null)
      setRefresh(x => x + 1)
    } catch (e: any) {
      setError(e)
    }
  }

  // Xóa loại phòng
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa loại phòng này?")) return
    try {
      await loaiPhongApi.deleteLoaiPhong(id)
      setRefresh(x => x + 1)
    } catch (e: any) {
      setError(e)
    }
  }

  // Sửa loại phòng
  const handleEdit = (lp: loaiPhongApi.LoaiPhong) => {
    setForm({tenLoaiPhong: lp.tenLoaiPhong, gia: lp.gia, moTa: lp.moTa, hinhAnh: lp.hinhAnh})
    setEditId(lp.idLoaiPhong)
    inputRef.current?.focus()
  }

  // Hủy sửa
  const handleCancelEdit = () => {
    setForm({tenLoaiPhong: "", gia: 0, moTa: ""})
    setEditId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý loại phòng</CardTitle>
        <CardDescription>Thêm, cập nhật, xóa loại phòng và ảnh minh họa</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-4 items-center">
          <Input ref={inputRef} required className="w-48" placeholder="Tên loại phòng" value={form.tenLoaiPhong} onChange={e=>setForm(f=>({...f, tenLoaiPhong: e.target.value}))} />
          <Input required type="number" min={1} className="w-32" placeholder="Giá" value={form.gia} onChange={e=>setForm(f=>({...f, gia: +e.target.value}))} />
          <Input required className="w-64" placeholder="Mô tả" value={form.moTa} onChange={e=>setForm(f=>({...f, moTa: e.target.value}))} />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && <span className="text-blue-500">Đang upload...</span>}
          {form.hinhAnh && <img src={toAbsoluteImgUrl(form.hinhAnh)} alt="Ảnh loại phòng" className="h-12 w-20 object-cover border" />}
          <Button type="submit">{editId ? "Cập nhật" : "Thêm mới"}</Button>
          {editId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Hủy</Button>}
        </form>
        {error && <div className="text-red-500">Lỗi: {error.message}</div>}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh</TableHead>
                <TableHead>Tên loại phòng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-40 text-right pr-4">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map(lp => {
                const imgUrl = toAbsoluteImgUrl(lp.hinhAnh)
                console.log(`Room ${lp.tenLoaiPhong}:`, { hinhAnh: lp.hinhAnh, imgUrl })
                return (
                  <TableRow key={lp.idLoaiPhong}>
                    <TableCell>
                      {imgUrl ? (
                        <img src={imgUrl} alt="Ảnh loại phòng" className="h-12 w-20 object-cover border" onError={(e) => {
                          console.log("Image failed to load:", imgUrl)
                          e.currentTarget.style.display = 'none'
                        }} />
                      ) : (
                        <span className="text-gray-400">Không có ảnh</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{lp.tenLoaiPhong}</TableCell>
                    <TableCell>{formatCurrencyVND(lp.gia)}</TableCell>
                    <TableCell>{lp.moTa}</TableCell>
                    <TableCell className="space-x-2 text-right pr-4">
                      <Button size="sm" variant="outline" onClick={()=>handleEdit(lp)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={()=>handleDelete(lp.idLoaiPhong)}>Xóa</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {roomTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">Chưa có loại phòng.</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function CreateRoomType({
  companies,
  units,
  onSubmit,
}: {
  companies: { id: string; name: string }[]
  units: { id: string; name: string; companyId: string }[]
  onSubmit: (data: Omit<import("@/lib/types").RoomType, "id">) => void
}) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(500000)
  const [capacity, setCapacity] = useState(1)
  const [sizeM2, setSizeM2] = useState(20)
  const [view, setView] = useState("Thành phố")
  const [companyId, setCompanyId] = useState(companies[0]?.id)
  const [unitId, setUnitId] = useState<string | undefined>(undefined)

  const filteredUnits = useMemo(() => units.filter((u) => u.companyId === companyId), [units, companyId])

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Input className="w-40" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        className="w-28"
        type="number"
        placeholder="Giá"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value || 0))}
      />
      <Input
        className="w-24"
        type="number"
        placeholder="Số người"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value || 1))}
      />
      <Input
        className="w-24"
        type="number"
        placeholder="m²"
        value={sizeM2}
        onChange={(e) => setSizeM2(Number(e.target.value || 20))}
      />
      <Input className="w-32" placeholder="View" value={view} onChange={(e) => setView(e.target.value)} />
      <Select value={companyId} onValueChange={setCompanyId}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Công ty" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={unitId} onValueChange={(v) => setUnitId(v)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Đơn vị (tùy chọn)" />
        </SelectTrigger>
        <SelectContent>
          {filteredUnits.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() =>
          onSubmit({
            name,
            price,
            capacity,
            sizeM2,
            view,
            description: "",
            images: ["/placeholder.svg?height=600&width=900"],
            amenities: [],
            devices: [],
            companyId,
            unitId,
          })
        }
      >
        Thêm
      </Button>
    </div>
  )
}

function InlineEditRoomType({
  rt,
  companies,
  units,
  onSubmit,
}: {
  rt: import("@/lib/types").RoomType
  companies: { id: string; name: string }[]
  units: { id: string; name: string; companyId: string }[]
  onSubmit: (patch: Partial<import("@/lib/types").RoomType>) => void
}) {
  const [price, setPrice] = useState(rt.price)
  const [capacity, setCapacity] = useState(rt.capacity)
  const [companyId, setCompanyId] = useState(rt.companyId ?? companies[0]?.id)
  const [unitId, setUnitId] = useState<string | undefined>(rt.unitId)
  const filteredUnits = useMemo(() => units.filter((u) => u.companyId === companyId), [units, companyId])
  return (
    <div className="inline-flex gap-2">
      <Input className="w-28" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
      <Input
        className="w-20"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value || 1))}
      />
      <Select value={companyId} onValueChange={setCompanyId}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {companies.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={unitId} onValueChange={(v) => setUnitId(v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Đơn vị" />
        </SelectTrigger>
        <SelectContent>
          {filteredUnits.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" onClick={() => onSubmit({ price, capacity, companyId, unitId })}>
        Lưu
      </Button>
    </div>
  )
}
