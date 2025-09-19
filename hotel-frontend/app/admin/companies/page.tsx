"use client"
import { getCompanies, addCompany, updateCompany, deleteCompany } from "@/lib/admin-db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

export default function AdminCompaniesPage() {
  const [refresh, setRefresh] = useState(0)
  const [data, setData] = useState<Awaited<ReturnType<typeof getCompanies>>>([])

  // load companies from backend
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const cs = await getCompanies()
      if (mounted) setData(cs)
    })()
    return () => {
      mounted = false
    }
  }, [refresh])

  async function onCreate(form: { code: string; name: string; active: boolean }) {
    if (!form.code.trim() || !form.name.trim()) {
      alert("Vui lòng nhập đầy đủ Mã và Tên công ty")
      return
    }
    const created = await addCompany({ code: form.code.trim(), name: form.name.trim(), active: form.active })
    setData((prev) => [created, ...prev])
  }
  async function onUpdate(id: string, patch: { name: string; active: boolean }) {
    if (!patch.name.trim()) {
      alert("Vui lòng nhập Tên công ty")
      return
    }
    const updated = await updateCompany(id, { name: patch.name.trim(), active: patch.active })
    setData((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }
  async function onDelete(id: string) {
    await deleteCompany(id)
    setData((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý công ty</CardTitle>
        <CardDescription>Thêm, sửa, xóa thông tin công ty trong hệ thống</CardDescription>
        <CardAction>
          <CreateCompany onSubmit={onCreate} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-40 text-right pr-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.code}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  <span className={c.active ? "text-green-600" : "text-slate-400"}>{c.active ? "Hoạt động" : "Ngừng"}</span>
                </TableCell>
                <TableCell className="space-x-2 text-right pr-4">
                  <EditCompany
                    company={{ id: c.id, name: c.name, active: c.active }}
                    onSubmit={(patch) => onUpdate(c.id, patch)}
                  />
                  <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Chưa có công ty.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CreateCompany({ onSubmit }: { onSubmit: (data: { code: string; name: string; active: boolean }) => void }) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [active, setActive] = useState(true)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm công ty</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm công ty</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Mã công ty</Label>
            <Input required value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Tên công ty</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Hoạt động</Label>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!code.trim() || !name.trim()) return
              onSubmit({ code, name, active })
              setOpen(false)
              setCode("")
              setName("")
              setActive(true)
            }}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditCompany({
  company,
  onSubmit,
}: {
  company: { id: string; name: string; active: boolean }
  onSubmit: (patch: { name: string; active: boolean }) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(company.name)
  const [active, setActive] = useState(company.active)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Sửa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa công ty</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Tên công ty</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Hoạt động</Label>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onSubmit({ name, active })
              setOpen(false)
            }}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
