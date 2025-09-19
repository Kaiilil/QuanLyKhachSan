"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RevenueChart } from "@/components/admin/charts"
import { ThanhToanDTO, getThanhToanByDate, getThanhToanBetween } from "@/lib/thanhtoan-api"

type Mode = "day" | "month" | "year" | "range"

export default function AdminRevenuePage() {
  const [mode, setMode] = useState<Mode>("day")
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10))
  const [month, setMonth] = useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}`
  })
  const [year, setYear] = useState<string>(String(new Date().getFullYear()))
  const [rangeStart, setRangeStart] = useState<string>(new Date().toISOString().slice(0,10))
  const [rangeEnd, setRangeEnd] = useState<string>(new Date().toISOString().slice(0,10))
  const [loading, setLoading] = useState(false)
  const [payments, setPayments] = useState<ThanhToanDTO[]>([])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, date, month, year, rangeStart, rangeEnd])

  async function loadData() {
    try {
      setLoading(true)
      if (mode === "day") {
        const rs = await getThanhToanByDate(date)
        setPayments(rs)
      } else if (mode === "month") {
        // If backend supports current month only, derive start/end of selected month
        const [y, m] = month.split("-").map(Number)
        const start = new Date(y, (m ?? 1) - 1, 1)
        const end = new Date(y, (m ?? 1), 0)
        const rs = await getThanhToanBetween(formatDate(start), formatDate(end))
        setPayments(rs)
      } else if (mode === "year") {
        const y = Number(year)
        const start = new Date(y, 0, 1)
        const end = new Date(y, 11, 31)
        const rs = await getThanhToanBetween(formatDate(start), formatDate(end))
        setPayments(rs)
      } else if (mode === "range") {
        const rs = await getThanhToanBetween(rangeStart, rangeEnd)
        setPayments(rs)
      }
    } finally {
      setLoading(false)
    }
  }

  function formatDate(d: Date) {
    return d.toISOString().slice(0,10)
  }

  function isCompleted(p: ThanhToanDTO) {
    const status = (p.trangThai || "").trim().toLowerCase()
    return status === "hoàn thành" || status === "hoan thanh" || status === "đã thanh toán" || status === "da thanh toan"
  }

  const completedPayments = useMemo(() => (payments || []).filter(isCompleted), [payments])

  const total = useMemo(() => {
    return completedPayments.reduce((sum, p) => sum + (p.soTien || 0), 0)
  }, [completedPayments])

  const chartData = useMemo(() => {
    // Group by date string p.ngayTt
    const map = new Map<string, number>()
    for (const p of completedPayments) {
      const key = p.ngayTt || ""
      if (!key) continue
      map.set(key, (map.get(key) || 0) + (p.soTien || 0))
    }
    const arr = Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amount]) => ({ date, amount }))
    return arr
  }, [completedPayments])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Thống kê doanh thu</CardTitle>
              <CardDescription>Lọc theo ngày, tháng, năm hoặc khoảng thời gian</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Chế độ</Label>
              <Select value={mode} onValueChange={(v: Mode) => setMode(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chế độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Theo ngày</SelectItem>
                  <SelectItem value="month">Theo tháng</SelectItem>
                  <SelectItem value="year">Theo năm</SelectItem>
                  <SelectItem value="range">Khoảng thời gian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "day" && (
              <div>
                <Label>Ngày</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            )}

            {mode === "month" && (
              <div>
                <Label>Tháng</Label>
                <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              </div>
            )}

            {mode === "year" && (
              <div>
                <Label>Năm</Label>
                <Input type="number" min={2000} max={3000} value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
            )}

            {mode === "range" && (
              <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-2">
                <div>
                  <Label>Từ ngày</Label>
                  <Input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
                </div>
                <div>
                  <Label>Đến ngày</Label>
                  <Input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex items-end">
              <Button onClick={loadData} disabled={loading}>{loading ? "Đang tải..." : "Làm mới"}</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Tổng doanh thu</CardTitle>
                <CardDescription>
                  {mode === "day" && `Ngày ${date}`}
                  {mode === "month" && `Tháng ${month}`}
                  {mode === "year" && `Năm ${year}`}
                  {mode === "range" && `${rangeStart} → ${rangeEnd}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{total.toLocaleString('vi-VN')}đ</div>
                <div className="text-xs text-muted-foreground mt-2">Chỉ tính các khoản đã thanh toán trong kỳ đã chọn</div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <RevenueChart data={chartData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


