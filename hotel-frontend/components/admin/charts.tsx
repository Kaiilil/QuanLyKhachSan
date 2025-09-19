"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type RechartsModule = typeof import("recharts")

export function RevenueChart({ data }: { data: { date: string; amount: number }[] }) {
  const [R, setR] = useState<RechartsModule | null>(null)
  useEffect(() => {
    let mounted = true
    import("recharts").then((mod) => {
      if (mounted) setR(mod)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (!R) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo ngày</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          Đang tải biểu đồ...
        </CardContent>
      </Card>
    )
  }

  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } = R

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo ngày</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function BookingsChart({ data }: { data: { day: string; count: number }[] }) {
  const [R, setR] = useState<RechartsModule | null>(null)
  useEffect(() => {
    let mounted = true
    import("recharts").then((mod) => {
      if (mounted) setR(mod)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (!R) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn đặt theo ngày</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          Đang tải biểu đồ...
        </CardContent>
      </Card>
    )
  }

  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } = R

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn đặt theo ngày</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
