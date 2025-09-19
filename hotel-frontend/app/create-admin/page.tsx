"use client"

import type React from "react"

import SiteHeader from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { upsertAdmin } from "@/lib/db"

export default function CreateAdminPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin2@hotel.com")
  const [username, setUsername] = useState("admin2")
  const [password, setPassword] = useState("admin456")
  const [fullName, setFullName] = useState("Quản trị viên mới")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      upsertAdmin({ email, username, password, fullName })
      router.push("/admin")
    } catch (err: any) {
      setError(err?.message || "Không thể tạo Admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-md px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Tạo tài khoản Admin (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Tên đăng nhập</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Họ tên (tùy chọn)</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo Admin và vào Dashboard"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Chỉ dùng cho mục đích demo. Trên môi trường thật, hãy vô hiệu trang này và quản trị quyền qua backend.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">
            Sau khi tạo xong, bạn sẽ được chuyển tới trang /admin. Nếu gặp lỗi, hãy xóa dữ liệu demo (localStorage) rồi
            thử lại.
          </p>
        </div>
      </div>
    </main>
  )
}
