"use client"

import AdminLayout from "../layout"
import { getFloors, addFloor, updateFloor, deleteFloor, getUnits } from "@/lib/admin-db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState, useEffect } from "react"

export default function AdminFloorsPage() {
  const [refresh, setRefresh] = useState(0)
  const [floors, setFloors] = useState<import("@/lib/admin-db").Floor[]>([])
  const [units, setUnits] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  const unitMap = useMemo(() => Object.fromEntries(units.map((u) => [u.id, u.name])), [units])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const [fs, us] = await Promise.all([
          getFloors(),
          getUnits()
        ])
        if (mounted) {
          setFloors(fs)
          setUnits(us)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        if (mounted) {
          setFloors([])
          setUnits([])
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
              <CardTitle>Quản lý Tầng</CardTitle>
              <CardDescription>Thêm, sửa, xóa tầng theo từng đơn vị</CardDescription>
            </div>
            <CardAction>
              <CreateFloor
                units={units}
                onSubmit={async (data) => {
                  try {
                    await addFloor(data)
                    setRefresh((x) => x + 1)
                  } catch (err) {
                    console.error("Failed to add floor:", err)
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
                  <TableHead>Tên tầng</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead className="w-40 text-right pr-4">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {floors.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{unitMap[f.unitId] ?? f.unitId}</TableCell>
                    <TableCell className="space-x-2 text-right pr-4">
                      <InlineEditFloor
                        floor={f}
                        units={units}
                        onSubmit={async (patch) => {
                          try {
                            await updateFloor(f.id, patch)
                            setRefresh((x) => x + 1)
                          } catch (err) {
                            console.error("Failed to update floor:", err)
                          }
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            await deleteFloor(f.id)
                            setRefresh((x) => x + 1)
                          } catch (err) {
                            console.error("Failed to delete floor:", err)
                          }
                        }}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {floors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      Chưa có tầng.
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

function CreateFloor({
  units,
  onSubmit,
}: {
  units: { id: string; name: string }[]
  onSubmit: (data: { name: string; unitId: string }) => void
}) {
  const [name, setName] = useState("")
  const [unitId, setUnitId] = useState(units[0]?.id ?? "")

  useEffect(() => {
    setUnitId((prev) => (prev ? prev : units[0]?.id ?? ""))
  }, [units])
  return (
    <div className="flex gap-2">
      <Input placeholder="Tên tầng" value={name} onChange={(e) => setName(e.target.value)} />
      <Select value={unitId || undefined} onValueChange={setUnitId}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Chọn đơn vị" />
        </SelectTrigger>
        <SelectContent>
          {units
            .filter((u) => (u.id ?? "").toString().trim() !== "")
            .map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name || u.id}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          if (!name.trim()) return alert("Vui lòng nhập tên tầng")
          if (!unitId) return alert("Vui lòng chọn đơn vị")
          onSubmit({ name: name.trim(), unitId })
          setName("")
        }}
      >
        Thêm
      </Button>
    </div>
  )
}

function InlineEditFloor({
  floor,
  units,
  onSubmit,
}: {
  floor: { id: string; name: string; unitId: string }
  units: { id: string; name: string }[]
  onSubmit: (patch: { name: string; unitId: string }) => void
}) {
  const [name, setName] = useState(floor.name)
  const [unitId, setUnitId] = useState(floor.unitId)
  return (
    <div className="inline-flex gap-2">
      <Input className="w-36" value={name} onChange={(e) => setName(e.target.value)} />
      <Select value={unitId || undefined} onValueChange={setUnitId}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {units
            .filter((u) => (u.id ?? "").toString().trim() !== "")
            .map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name || u.id}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" onClick={() => {
        if (!name.trim()) return alert("Vui lòng nhập tên tầng")
        if (!unitId) return alert("Vui lòng chọn đơn vị")
        onSubmit({ name: name.trim(), unitId })
      }}>
        Lưu
      </Button>
    </div>
  )
}
