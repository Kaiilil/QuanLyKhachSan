"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Hotel, LogIn, LogOut, UserRound, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/use-session"
import { signOut, validateAndSyncSession } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function SiteHeader(props: { className?: string }) {
  const { className = "" } = props
  const { user, isAdmin, ready } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const nav = [
    { href: "/", label: "Trang chủ" },
    { href: "/rooms", label: "Loại phòng" },
    { href: "/booking", label: "Đặt phòng" },
    { href: "/checkout", label: "Thanh toán" },
  ]
  return (
    <header className={cn("sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b", className)}>
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Hotel className="h-5 w-5 text-blue-600" />
          <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Khách sạn</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "text-sm px-3 py-2 rounded-full transition-colors",
                pathname === n.href
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              {n.label}
            </Link>
          ))}
          {ready && isAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "text-sm inline-flex items-center gap-1 px-3 py-2 rounded-full transition-colors",
                pathname?.startsWith("/admin")
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {!ready ? (
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : user ? (
            <>
              {isAdmin ? <Badge variant="secondary">Admin</Badge> : null}
              <Button variant="ghost" size="sm" onClick={() => router.push("/account")}>
                <UserRound className="h-4 w-4 mr-2" />
                Tài khoản
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="hover:border-blue-400"
                onClick={() => {
                  signOut()
                  router.push("/")
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/sign-in">
                  <LogIn className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-glow" asChild>
                <Link href="/sign-up">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />
    </header>
  )
}
