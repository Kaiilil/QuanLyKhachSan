"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  Building2,
  Building,
  Layers,
  BedDouble,
  BedSingle,
  Users2,
  Cpu,
  Wrench,
  CalendarClock,
  Receipt,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart2 },
  { href: "/admin/companies", label: "Công ty", icon: Building2 },
  { href: "/admin/units", label: "Đơn vị", icon: Building },
  { href: "/admin/floors", label: "Tầng", icon: Layers },
  { href: "/admin/room-types", label: "Loại phòng", icon: BedDouble },
  { href: "/admin/rooms", label: "Phòng", icon: BedSingle },
  { href: "/admin/customers", label: "Khách hàng", icon: Users2 },
  { href: "/admin/devices", label: "Thiết bị", icon: Cpu },
  { href: "/admin/room-devices", label: "Gán thiết bị", icon: Wrench },
  { href: "/admin/bookings", label: "Đơn đặt", icon: CalendarClock },
  { href: "/admin/payments", label: "Thanh toán", icon: Receipt },
  { href: "/admin/revenue", label: "Doanh thu", icon: BarChart2 },
  { href: "/admin/users", label: "Người dùng & Quyền", icon: UserCog },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-full md:w-[260px] border-r bg-white rounded-xl md:rounded-lg md:sticky md:top-[76px] h-fit self-start shadow-sm">
      <div className="px-4 pt-4 pb-2 text-xs font-semibold tracking-wider uppercase text-slate-500">Quản trị</div>
      <div className="px-4">
        <div className="h-px bg-slate-100" />
      </div>
      <nav className="px-2 py-2 space-y-1">
        {items.map((it) => {
          const ActiveIcon = it.icon
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-2 mx-2 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <ActiveIcon className={cn("h-4 w-4", active ? "text-blue-700" : "text-slate-500")} />
              {it.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
