"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/db"
import { Eye, EyeOff, Lock, User as UserIcon } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [username, setUsername] = useState("user")
  const [password, setPassword] = useState("user123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(username, password)
      router.replace("/")
    } catch (err: any) {
      setError(err.message ?? "Đăng nhập thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Chào mừng trở lại 👋</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Đăng nhập để tiếp tục quản lý đặt phòng, theo dõi thanh toán và khám phá nhiều ưu đãi hấp dẫn.
          </p>
          <img
            src="/indochine-palace-342222.jpg"
            alt="Khách sạn sang trọng"
            className="rounded-2xl shadow-2xl border border-gray-100 object-cover w-full h-72"
          />
        </div>
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label>Tên đăng nhập</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
              <div className="text-sm text-gray-600 text-center">
                Chưa có tài khoản?{" "}
                <Link className="text-blue-600 hover:underline" href="/sign-up">Đăng ký ngay</Link>
              </div>
              
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
