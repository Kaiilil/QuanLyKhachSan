"use client"

import {
  getUnits,
  addUnit,
  updateUnit,
  deleteUnit,
  getCompanies,
  searchUnitsByName,
  searchUnitsByKeyword,
  existsUnitName,
  countUnits,
} from "@/lib/admin-db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, RefreshCw, Search, Plus, Edit, Trash2 } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"

export default function AdminUnitsPage() {
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [units, setUnits] = useState<{ id: string; name: string; companyId: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [q, setQ] = useState("")
  const [stats, setStats] = useState({ total: 0, nameExists: false })

  // Debug logging
  console.log("AdminUnitsPage render:", { 
    companiesLength: companies.length, 
    unitsLength: units.length, 
    loading, 
    error,
    stats 
  })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError("")
        console.log("Loading data...") // Added debug log
        
        console.log("Calling getCompanies...")
        const cs = await getCompanies()
        console.log("Companies loaded:", cs)
        
        console.log("Calling getUnits...")
        const us = await getUnits()
        console.log("Units loaded:", us)
        
        console.log("Calling countUnits...")
        const total = await countUnits()
        console.log("Total count:", total)

        console.log("API responses:", { companies: cs, units: us, total }) // Added debug log

        if (mounted) {
          setCompanies(cs)
          setUnits(us)
          setStats((s) => ({ ...s, total }))
        }
      } catch (err: any) {
        console.error("Error loading data:", err) // Added debug log
        if (mounted) {
          setError(err?.message || "Không thể tải dữ liệu")
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [refresh])

  // Làm mới dữ liệu
  async function onRefresh() {
    setQ("")
    setStats((s) => ({ ...s, nameExists: false }))
    setRefresh((prev) => prev + 1)
  }

  // Lọc theo tên
  async function onSearchByName() {
    if (!q.trim()) return
    try {
      setLoading(true)
      const res = await searchUnitsByName(q.trim())
      setUnits(res)
      setStats((s) => ({ ...s, total: res.length }))
    } catch (err: any) {
      setError(err?.message || "Lỗi khi tìm kiếm")
    } finally {
      setLoading(false)
    }
  }

  // Lọc theo từ khóa
  async function onSearchByKeyword() {
    if (!q.trim()) return
    try {
      setLoading(true)
      const res = await searchUnitsByKeyword(q.trim())
      setUnits(res)
      setStats((s) => ({ ...s, total: res.length }))
    } catch (err: any) {
      setError(err?.message || "Lỗi khi tìm kiếm")
    } finally {
      setLoading(false)
    }
  }

  // Kiểm tra tên tồn tại
  async function onCheckNameExists() {
    if (!q.trim()) return
    try {
      const exists = await existsUnitName(q.trim())
      setStats((s) => ({ ...s, nameExists: exists }))
    } catch (err: any) {
      setError(err?.message || "Lỗi khi kiểm tra tên")
    }
  }

  // Xử lý Enter trong input tìm kiếm
  function onSearchKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onSearchByKeyword()
    }
  }

  const companyMap = useMemo(() => {
    const map: Record<string, string> = {}
    companies.forEach((c) => (map[c.id] = c.name))
    console.log("Company map created:", map)
    return map
  }, [companies])

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <Button onClick={onRefresh} className="mt-2">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <CardTitle>Quản lý Đơn vị</CardTitle>
              <CardDescription>Thêm, tìm kiếm và chỉnh sửa các đơn vị thuộc công ty</CardDescription>
            </div>
            <Badge variant="secondary">Tổng: {stats.total}</Badge>
            {q && (
              <Badge variant={stats.nameExists ? "destructive" : "default"}>
                {stats.nameExists ? "Tên đã tồn tại" : "Tên chưa tồn tại"}
              </Badge>
            )}
          </div>
          <CardAction>
            <CreateUnit
              companies={companies}
              onSubmit={async (data) => {
                try {
                  const created = await addUnit(data)
                  setUnits((prev) => [created, ...prev])
                  setStats((s) => ({ ...s, total: s.total + 1 }))
                  setQ("")
                  setStats((s) => ({ ...s, nameExists: false }))
                } catch (err: any) {
                  setError(err?.message || "Không thể thêm đơn vị")
                }
              }}
            />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm theo tên hoặc từ khóa..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={onSearchKeyPress}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={onSearchByName} disabled={!q.trim() || loading}>
            Lọc theo tên
          </Button>
          <Button variant="outline" onClick={onSearchByKeyword} disabled={!q.trim() || loading}>
            Lọc theo từ khóa
          </Button>
          <Button variant="outline" onClick={onCheckNameExists} disabled={!q.trim() || loading}>
            Kiểm tra tên
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Tên đơn vị</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead className="w-48 text-right pr-4">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Đang tải...
                    </div>
                  </TableCell>
                </TableRow>
              ) : units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {q ? "Không tìm thấy đơn vị nào." : "Chưa có đơn vị nào."}
                  </TableCell>
                </TableRow>
              ) : (
                units.map((u, index) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-sm">{index + 1}</TableCell>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>
                      {companyMap[u.companyId] ? (
                        <Badge variant="outline">{companyMap[u.companyId]}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="space-x-2 text-right pr-4">
                      <EditUnit
                        unit={u}
                        companies={companies}
                        onSubmit={async (patch) => {
                          try {
                            const updated = await updateUnit(u.id, patch)
                            setUnits((prev) => prev.map((x) => (x.id === u.id ? updated : x)))
                          } catch (err: any) {
                            setError(err?.message || "Không thể cập nhật đơn vị")
                          }
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!confirm(`Bạn có chắc muốn xóa đơn vị "${u.name}"?`)) return
                          try {
                            await deleteUnit(u.id)
                            setUnits((prev) => prev.filter((x) => x.id !== u.id))
                            setStats((s) => ({ ...s, total: s.total - 1 }))
                          } catch (err: any) {
                            const msg = err?.message || "Xóa đơn vị thất bại"
                            setError(msg)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function CreateUnit({
  companies,
  onSubmit,
}: {
  companies: { id: string; name: string }[]
  onSubmit: (data: { name: string; companyId: string }) => void
}) {
  const [name, setName] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset companyId khi companies thay đổi
  useEffect(() => {
    if (companies.length > 0 && !companyId) {
      setCompanyId(companies[0].id)
    }
  }, [companies, companyId])

  async function handleSubmit() {
    if (!name.trim() || !companyId) {
      console.log("Validation failed:", { name: name.trim(), companyId, companiesLength: companies.length })
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), companyId })
      setName("")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Debug info
  console.log("CreateUnit render:", { 
    companiesLength: companies.length, 
    name, 
    companyId, 
    isSubmitting,
    buttonDisabled: !name.trim() || !companyId || isSubmitting 
  })

  if (companies.length === 0) {
    return (
      <Button disabled>
        <Plus className="h-4 w-4 mr-2" />
        Thêm đơn vị (Chưa có công ty)
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Input 
        placeholder="Tên đơn vị" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        disabled={isSubmitting}
      />
      <Select value={companyId || undefined} onValueChange={setCompanyId} disabled={isSubmitting}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Chọn công ty" />
        </SelectTrigger>
        <SelectContent>
          {companies
            .filter((c) => (c.id ?? "").toString().trim() !== "")
            .map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name || c.id}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={handleSubmit}
        disabled={!name.trim() || !companyId || isSubmitting}
        className={!name.trim() || !companyId ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Plus className="h-4 w-4 mr-2" />
        {isSubmitting ? "Đang thêm..." : "Thêm"}
      </Button>
      {/* Debug info */}
      <div className="text-xs text-muted-foreground ml-2">
        {name.trim() ? "✓" : "✗"} Tên | {companyId ? "✓" : "✗"} Công ty
      </div>
    </div>
  )
}

function EditUnit({
  unit,
  companies,
  onSubmit,
}: {
  unit: { id: string; name: string; companyId: string }
  companies: { id: string; name: string }[]
  onSubmit: (patch: { name: string; companyId: string }) => void
}) {
  const [name, setName] = useState(unit.name)
  const [companyId, setCompanyId] = useState(unit.companyId)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form khi unit thay đổi
  useEffect(() => {
    setName(unit.name)
    setCompanyId(unit.companyId)
  }, [unit])

  async function handleSubmit() {
    if (!name.trim() || !companyId) return
    
    setIsSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), companyId })
      setIsEditing(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    setName(unit.name)
    setCompanyId(unit.companyId)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
        <Edit className="h-4 w-4 mr-2" />
        Sửa
      </Button>
    )
  }

  return (
    <div className="inline-flex gap-2">
      <Input 
        className="w-40" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
      />
      <Select value={companyId || undefined} onValueChange={setCompanyId} disabled={isSubmitting}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {companies
            .filter((c) => (c.id ?? "").toString().trim() !== "")
            .map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name || c.id}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Button 
        size="sm" 
        onClick={handleSubmit}
        disabled={!name.trim() || !companyId || isSubmitting}
      >
        {isSubmitting ? "Đang lưu..." : "Lưu"}
      </Button>
      <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
        Hủy
      </Button>
    </div>
  )
}
