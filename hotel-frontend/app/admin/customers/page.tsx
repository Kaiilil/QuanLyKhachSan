"use client"

import AdminLayout from "../layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useMemo, useState } from "react"
import * as khApi from "@/lib/khachhang-api"
import { toast } from "sonner"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<khApi.KhachHangDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)

  // form state
  const [form, setForm] = useState<khApi.KhachHangDTO>({ hoTen: "", email: "", soDienThoai: "", cccd: "", diaChi: "" })
  const [editId, setEditId] = useState<number | null>(null)
  const [keyword, setKeyword] = useState("")

  // Validators
  const isValidEmail = (value: string) => {
    const v = value.trim()
    if (!v) return true
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v)
  }
  const isValidPhoneVN = (value: string) => {
    const v = value.replace(/[^\d]/g, "")
    if (!v) return true
    return /^0\d{9}$/.test(v) || /^84\d{9}$/.test(v)
  }
  const isValidCCCD = (value: string) => {
    const v = value.replace(/[^\d]/g, "")
    if (!v) return true
    return /^\d{12}$/.test(v)
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = keyword.trim()
          ? await khApi.searchKhachHang(keyword.trim())
          : await khApi.getAllKhachHang()
        // 1) Ưu tiên khử trùng lặp theo CCCD (phải duy nhất)
        const byCccd = new Map<string, khApi.KhachHangDTO>()
        for (const kh of data) {
          const cccdNorm = (kh.cccd || '').replace(/[^\d]/g, '')
          if (cccdNorm) {
            const exist = byCccd.get(cccdNorm)
            if (!exist || (kh.idKh || 0) > (exist.idKh || 0)) byCccd.set(cccdNorm, kh)
          }
        }
        const picked = new Set<number>()
        const result: khApi.KhachHangDTO[] = []
        for (const v of byCccd.values()) {
          if (v.idKh != null) picked.add(v.idKh)
          result.push(v)
        }
        // 2) Với các bản ghi không có CCCD, khử trùng lặp theo email+SĐT
        const byEmailPhone = new Map<string, khApi.KhachHangDTO>()
        for (const kh of data) {
          if (kh.idKh != null && picked.has(kh.idKh)) continue
          const key = `${(kh.email || '').toLowerCase()}|${kh.soDienThoai || ''}`
          const exist = byEmailPhone.get(key)
          if (!exist || (kh.idKh || 0) > (exist.idKh || 0)) byEmailPhone.set(key, kh)
        }
        for (const v of byEmailPhone.values()) result.push(v)
        if (mounted) setCustomers(result)
      } catch (e: any) {
        if (mounted) setError(e?.message || "Lỗi tải dữ liệu")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [refresh, keyword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const hoTen = (form.hoTen || "").trim()
      const email = (form.email || "").trim()
      const soDienThoai = (form.soDienThoai || "").replace(/[^\d]/g, "")
      const cccd = (form.cccd || "").replace(/[^\d]/g, "")
      const diaChi = (form.diaChi || "").trim()

      if (!hoTen) {
        toast.error("Vui lòng nhập họ tên")
        return
      }
      if (!email) {
        toast.error("Vui lòng nhập email")
        return
      }
      if (!isValidEmail(email)) {
        toast.error("Email không hợp lệ")
        return
      }
      if (!soDienThoai) {
        toast.error("Vui lòng nhập số điện thoại")
        return
      }
      if (!isValidPhoneVN(soDienThoai)) {
        toast.error("Số điện thoại không hợp lệ (10 số bắt đầu bằng 0 hoặc 84xxxxxxxxx)")
        return
      }
      if (!cccd) {
        toast.error("Vui lòng nhập CCCD")
        return
      }
      if (!isValidCCCD(cccd)) {
        toast.error("CCCD phải gồm 12 chữ số")
        return
      }
      if (!diaChi) {
        toast.error("Vui lòng nhập địa chỉ")
        return
      }
      // Uniqueness checks
      const emailKey = email.toLowerCase()
      const cccdKey = cccd.replace(/[^\d]/g, "")
      const emailExists = customers.some((kh) => (kh.email || "").toLowerCase() === emailKey && kh.idKh !== editId)
      if (emailExists) {
        toast.error("Email đã tồn tại. Vui lòng dùng email khác")
        return
      }
      const cccdExists = customers.some((kh) => (kh.cccd || "").replace(/[^\d]/g, "") === cccdKey && kh.idKh !== editId)
      if (cccdExists) {
        toast.error("CCCD đã tồn tại. Vui lòng kiểm tra lại")
        return
      }
      if (editId) {
        await khApi.updateKhachHang(editId, {
          hoTen,
          email,
          soDienThoai,
          cccd,
          diaChi,
        })
        toast.success("Cập nhật khách hàng thành công")
      } else {
        await khApi.createKhachHang({ hoTen, email, soDienThoai, cccd, diaChi })
        toast.success("Thêm khách hàng thành công")
      }
      setForm({ hoTen: "", email: "", soDienThoai: "", cccd: "", diaChi: "" })
      setEditId(null)
      setRefresh((x) => x + 1)
    } catch (e: any) {
      toast.error(e?.message || "Lưu khách hàng thất bại")
    }
  }

  const handleEdit = (kh: khApi.KhachHangDTO) => {
    setForm({ hoTen: kh.hoTen || "", email: kh.email || "", soDienThoai: kh.soDienThoai || "", cccd: kh.cccd || "", diaChi: kh.diaChi || "" })
    setEditId(kh.idKh!)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa khách hàng này?")) return
    try {
      await khApi.deleteKhachHang(id)
      toast.success("Đã xóa khách hàng")
      setRefresh((x) => x + 1)
    } catch (e: any) {
      toast.error(e?.message || "Xóa khách hàng thất bại")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khách hàng</CardTitle>
        <CardDescription>Thêm mới, tìm kiếm và quản lý thông tin khách hàng</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4 items-center">
          <Input required className="w-48" placeholder="Họ tên" value={form.hoTen} onChange={(e) => setForm((f) => ({ ...f, hoTen: e.target.value }))} />
          <Input required className="w-48" placeholder="Email" type="email" value={form.email || ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input required className="w-40" placeholder="SĐT" value={form.soDienThoai || ""} onChange={(e) => setForm((f) => ({ ...f, soDienThoai: e.target.value }))} />
          <Input required className="w-40" placeholder="CCCD" value={form.cccd || ""} onChange={(e) => setForm((f) => ({ ...f, cccd: e.target.value }))} />
          <Input required className="w-64" placeholder="Địa chỉ" value={form.diaChi || ""} onChange={(e) => setForm((f) => ({ ...f, diaChi: e.target.value }))} />
          <Button type="submit">{editId ? "Cập nhật" : "Thêm"}</Button>
          {editId && (
            <Button type="button" variant="outline" onClick={() => (setEditId(null), setForm({ hoTen: "", email: "", soDienThoai: "", cccd: "", diaChi: "" }))}>
              Hủy
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Input className="w-64" placeholder="Tìm theo từ khóa" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
        </form>

        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div className="text-center py-6 text-muted-foreground">Đang tải...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>CCCD</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead className="w-40 text-right pr-4">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((kh) => (
                <TableRow key={kh.idKh}>
                  <TableCell className="font-medium">{kh.hoTen}</TableCell>
                  <TableCell>{kh.email}</TableCell>
                  <TableCell>{kh.soDienThoai}</TableCell>
                  <TableCell>{kh.cccd}</TableCell>
                  <TableCell>{kh.diaChi}</TableCell>
                  <TableCell className="space-x-2 text-right pr-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(kh)}>
                      Sửa
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(kh.idKh!)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    Không có khách hàng.
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
