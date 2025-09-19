import Link from "next/link"

export default function SiteFooter() {
  const year = new Date().getFullYear()
  const nav = [
    { href: "/", label: "Trang chủ" },
    { href: "/rooms", label: "Loại phòng" },
    { href: "/booking", label: "Đặt phòng" },
    { href: "/checkout", label: "Thanh toán" },
  ]
  return (
    <footer className="mt-10 border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Khách sạn
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Trải nghiệm nghỉ dưỡng sang trọng với dịch vụ tận tâm và tiện nghi hiện đại.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-2 text-sm">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-gray-600 hover:text-blue-700 hover:underline underline-offset-4">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-gray-600 md:text-right">
          <p>
            © {year} Khách sạn. All rights reserved.
          </p>
          <p className="mt-1">
            Made with ❤️ for a better stay.
          </p>
        </div>
      </div>
    </footer>
  )
}


