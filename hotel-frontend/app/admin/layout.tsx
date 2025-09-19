"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SiteHeader from "@/components/site-header"
import AdminSidebar from "@/components/admin/sidebar"
import { useSession } from "@/hooks/use-session"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, ready } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!user) router.push("/sign-in")
    else if (!isAdmin) router.push("/")
  }, [ready, user, isAdmin, router])

  if (!ready) {
    return (
      <main>
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground">
          {"Đang kiểm tra quyền truy cập..."}
        </div>
      </main>
    )
  }

  if (!user || !isAdmin) return null

  return (
    <main className="bg-slate-50 min-h-[100dvh]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <AdminSidebar />
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  )
}
