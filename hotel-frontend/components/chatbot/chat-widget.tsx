"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, MessageCircle, Send } from "lucide-react"
import { getAllLoaiPhong } from "@/lib/loai-phong-api"
import { getPhysicalRooms } from "@/lib/admin-db"
import { createDatPhong, findDatPhongByKhachHang, findDatPhongByLoaiPhong, findDatPhongByPhong, type DatPhongDTO } from "@/lib/datphong-api"
import { searchKhachHang, createKhachHang, type KhachHangDTO } from "@/lib/khachhang-api"

type ChatMessage = { role: "user" | "bot"; text: string }

type BookingState = {
  step: number
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  roomTypeId?: string
  roomId?: string
}

function parseDate(input: string): string | null {
  const v = input.trim()
  if (!v) return null
  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
  // dd/mm/yyyy
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) {
    const [_, d, mo, y] = m
    const dd = String(d).padStart(2, "0")
    const mm = String(mo).padStart(2, "0")
    return `${y}-${mm}-${dd}`
  }
  return null
}

function formatVN(dateIso: string): string {
  try {
    const d = new Date(dateIso)
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const yy = d.getFullYear()
    return `${dd}/${mm}/${yy}`
  } catch {
    return dateIso
  }
}

function rangesSummary(items: Array<{ start: string; end: string }>, limit = 5): string {
  if (items.length === 0) return "(Chưa có lịch bị chặn)"
  return items
    .slice(0, limit)
    .map((r) => `• ${formatVN(r.start)} → ${formatVN(r.end)}`)
    .join("\n")
}

// Parse date string to local midnight milliseconds, matching booking page logic
function toLocalMidnightMs(dateStr: string): number {
  if (!dateStr) return NaN
  // If contains time (T), use as-is; else append T00:00:00 for local interpretation
  const hasTime = /T/.test(dateStr)
  const src = hasTime ? dateStr : `${dateStr}T00:00:00`
  const d = new Date(src)
  return d.getTime()
}

function isOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const as = toLocalMidnightMs(aStart)
  const ae = toLocalMidnightMs(aEnd)
  const bs = toLocalMidnightMs(bStart)
  const be = toLocalMidnightMs(bEnd)
  // Overlap if aStart < bEnd AND aEnd > bStart (allow touching edges)
  return as < be && ae > bs
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Xin chào! Mình là trợ lý đặt phòng. Bạn có thể hỏi về giá, loại phòng, giờ check-in/check-out, hoặc nhờ mình đặt phòng." },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const [roomTypes, setRoomTypes] = useState<Array<{ id: string; name: string; price?: number; description?: string }>>([])
  const [booking, setBooking] = useState<BookingState>({ step: 0, name: "", email: "", phone: "", checkIn: "", checkOut: "" })
  const [checkoutBookingId, setCheckoutBookingId] = useState<number | null>(null)
  const [unavailableDates, setUnavailableDates] = useState<string[]>([])
  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates])
  const [roomsOfChosenType, setRoomsOfChosenType] = useState<Array<{ id: string; name: string }>>([])
  const [availableRooms, setAvailableRooms] = useState<Array<{ id: string; name: string }>>([])
  const [roomBookings, setRoomBookings] = useState<Record<string, Array<{ start: string; end: string }>>>({})
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined)
  const [manualFrom, setManualFrom] = useState<string>("")
  const [manualTo, setManualTo] = useState<string>("")

  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  useEffect(() => {
    ;(async () => {
      try {
        const rts = await getAllLoaiPhong()
        const mapped = rts.map((x: any) => ({ id: String(x.idLoaiPhong), name: x.tenLoaiPhong, price: x.gia, description: x.moTa }))
        setRoomTypes(mapped)
      } catch {
        // ignore
      }
    })()
  }, [])

  const roomTypeNameById = useMemo(() => Object.fromEntries(roomTypes.map((r) => [r.id, r.name])), [roomTypes])

  function reply(text: string) {
    setMessages((prev) => [...prev, { role: "bot", text }])
  }

  async function handleSend(userText?: string) {
    const text = (userText ?? input).trim()
    if (!text) return
    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")

    // If in booking flow, route answers to that flow
    if (booking.step > 0) {
      await handleBookingFlow(text)
      return
    }

    const lower = text.toLowerCase()

    // Basic intents
    if (/(xin chào|chào|hi|hello)/i.test(lower)) {
      reply("Chào bạn! Mình có thể giúp gì? Bạn có thể hỏi: loại phòng, giá, tiện ích, giờ nhận/trả phòng, hoặc nhờ mình đặt phòng.")
      return
    }

    if (/giờ.*(nhận|check\s*-?in)/i.test(lower) || /giờ.*(trả|check\s*-?out)/i.test(lower)) {
      reply("Giờ nhận phòng: 14:00. Giờ trả phòng: 12:00. Bạn muốn đặt phòng cho ngày nào?")
      return
    }

    if (/địa chỉ|ở đâu|address/i.test(lower)) {
      reply("Khách sạn hiện tại HCM. Bạn vẫn có thể xem loại phòng và đặt phòng thử.")
      return
    }

    if (/loại phòng|giá|bao nhiêu|phòng đôi|phòng đơn/i.test(lower)) {
      if (roomTypes.length === 0) {
        reply("Mình chưa lấy được danh sách loại phòng. Vui lòng thử lại sau.")
        return
      }
      const summary = roomTypes
        .slice(0, 5)
        .map((r) => `- ${r.name}${r.price ? `: ~${Number(r.price).toLocaleString("vi-VN")}đ/đêm` : ""}`)
        .join("\n")
      reply(`Một số loại phòng hiện có:\n${summary}\nBạn muốn đặt phòng? Hãy nhắn \"đặt phòng\".`)
      return
    }

    if (/đặt phòng|book(ing)?/i.test(lower)) {
      setBooking({ step: 1, name: "", email: "", phone: "", checkIn: "", checkOut: "" })
      const options = roomTypes.length ? ` (ví dụ: ${roomTypes.slice(0, 5).map((r) => r.name).join(", ")})` : ""
      reply(`Mình sẽ giúp bạn đặt phòng. Trước tiên, bạn muốn loại phòng nào?${options}`)
      return
    }

    // Fallback
    reply("Mình chưa hiểu câu hỏi. Bạn có thể hỏi về loại phòng, giá, giờ nhận/trả phòng, hoặc nhắn \"đặt phòng\" để đặt phòng.")
  }

  async function handleBookingFlow(answer: string) {
    const b = booking
    const say = (t: string) => reply(t)

    if (b.step === 1) {
      // Map answer to roomTypeId by name
      const normalized = answer.trim().toLowerCase()
      const found = roomTypes.find((r) => r.name.trim().toLowerCase().includes(normalized) || normalized.includes(r.name.trim().toLowerCase()))
      const chosenId = found?.id

      if (!chosenId) {
        setBooking({ ...b, step: 1, roomTypeId: undefined })
        say("Mình chưa nhận diện được loại phòng. Bạn hãy nhập lại tên loại phòng (ví dụ: Phòng đôi, Phòng đơn).")
        return
      }

      // Kiểm tra lịch đã đặt của loại phòng
      try {
        const [roomsAll, bookingsByType] = await Promise.all([
          getPhysicalRooms(),
          findDatPhongByLoaiPhong(Number(chosenId)),
        ])
        const roomsOfType = roomsAll.filter((r) => String(r.roomTypeId) === String(chosenId))
        const totalRooms = roomsOfType.length

        // Ranges summary (unique by booking)
        const futureRanges = bookingsByType
          .filter((dp) => dp.ngayDat && dp.ngayTra && (dp.trangThai || "").toLowerCase().indexOf("hủy") === -1)
          .map((dp) => ({ start: dp.ngayDat!, end: dp.ngayTra! }))
          .sort((a, c) => new Date(a.start).getTime() - new Date(c.start).getTime())

        // build unavailable date list to gray out on calendar (to chọn khoảng hợp lệ)
        const fullDays: Record<string, number> = {}
        for (const dp of bookingsByType) {
          if (!dp.ngayDat || !dp.ngayTra) continue
          const status = (dp.trangThai || "").toLowerCase()
          if (status.includes("hủy")) continue
          let d2 = new Date(dp.ngayDat)
          const end2 = new Date(dp.ngayTra)
          while (d2 < end2) {
            const key = d2.toISOString().slice(0, 10)
            fullDays[key] = (fullDays[key] || 0) + 1
            d2.setDate(d2.getDate() + 1)
          }
        }
        const disabled = Object.entries(fullDays)
          .filter(([, count]) => count >= totalRooms)
          .map(([k]) => k)
        setUnavailableDates(disabled)

        // Lấy lịch theo từng phòng để hiển thị
        const roomToBookings: Record<string, Array<{ start: string; end: string }>> = {}
        for (const r of roomsOfType) {
          try {
            const list = await findDatPhongByPhong(Number(r.id))
            roomToBookings[String(r.id)] = list
              .filter((dp) => dp.ngayDat && dp.ngayTra && (dp.trangThai || "").toLowerCase().indexOf("hủy") === -1)
              .map((dp) => ({ start: dp.ngayDat!, end: dp.ngayTra! }))
          } catch {
            roomToBookings[String(r.id)] = []
          }
        }
        setRoomBookings(roomToBookings)
        setRoomsOfChosenType(roomsOfType.map((r) => ({ id: String(r.id), name: r.name || `Phòng #${r.id}` })))
        setAvailableRooms(roomsOfType.map((r) => ({ id: String(r.id), name: r.name || `Phòng #${r.id}` })))

        setBooking({ ...b, step: 2, roomTypeId: chosenId })
        say(`Loại phòng: ${found?.name}. Vui lòng chọn khoảng ngày trên lịch (bấm ngày bắt đầu rồi bấm ngày kết thúc), hoặc nhập vào 2 ô bên dưới; sau đó chọn phòng không trùng lịch ở danh sách.`)
      } catch {
        // Nếu không kiểm tra được, tiếp tục quy trình như bình thường
      }

      return
    }

    // Step 2 is calendar/manual date selection handled by UI; if user types here, remind them
    if (b.step === 2) {
      say("Bạn hãy chọn khoảng ngày trên lịch bên trên, hoặc nhập 2 ngày vào ô Từ/Đến rồi nhấn OK.")
      return
    }

    // Step 3: Name -> ask email
    if (b.step === 3) {
      setBooking({ ...b, step: 4, name: answer })
      say("Email của bạn là gì?")
      return
    }

    // Step 4: Email -> ask phone
    if (b.step === 4) {
      setBooking({ ...b, step: 5, email: answer })
      say("Số điện thoại của bạn?")
      return
    }

    // Step 5: Phone -> finalize
    if (b.step === 5) {
      setBooking({ ...b, step: 6, phone: answer })
      await finalizeBooking({ ...b, phone: answer })
      return
    }
  }

  async function finalizeBooking(data: BookingState) {
    try {
      setLoading(true)
      // 1) Lấy/ tạo khách hàng theo email
      let customerId: number | undefined
      if (data.email) {
        try {
          const exists = await searchKhachHang(data.email)
          const exact = exists.find((k) => (k.email || "").trim().toLowerCase() === data.email.trim().toLowerCase())
          if (exact?.idKh) customerId = exact.idKh
        } catch {
          // ignore
        }
      }
      if (!customerId) {
        const created = await createKhachHang({ hoTen: data.name, email: data.email, soDienThoai: data.phone, cccd: "", diaChi: "" })
        customerId = created.idKh!
      }

      // 1.5) Kiểm tra trùng đơn đặt phòng (trùng khoảng ngày, chưa hủy)
      try {
        const existing = await findDatPhongByKhachHang(Number(customerId))
        const ci = new Date(data.checkIn).getTime()
        const co = new Date(data.checkOut).getTime()
        const overlap = existing.find((dp) => {
          const status = (dp.trangThai || "").toLowerCase()
          const isCancelled = status.includes("hủy")
          if (isCancelled) return false
          if (!dp.ngayDat || !dp.ngayTra) return false
          const s = new Date(dp.ngayDat).getTime()
          const e = new Date(dp.ngayTra).getTime()
          return Math.max(s, ci) < Math.min(e, co)
        })
        if (overlap) {
          reply(`Bạn đã có đơn đặt phòng #${overlap.idDatPhong} trong khoảng thời gian này. Bạn có thể thanh toán tại /checkout?datPhongId=${overlap.idDatPhong}`)
          setCheckoutBookingId(overlap.idDatPhong || null)
          setBooking({ step: 0, name: "", email: "", phone: "", checkIn: "", checkOut: "" })
          return
        }
      } catch {
        // nếu API lỗi, bỏ qua kiểm tra trùng để không chặn người dùng
      }

      // 2) Chọn phòng thực sự rảnh theo khoảng ngày (ưu tiên phòng người dùng đã chọn)
      const rooms = await getPhysicalRooms()
      const sameType = rooms.filter((r) => !data.roomTypeId || String(r.roomTypeId) === String(data.roomTypeId))
      if (sameType.length === 0) {
        reply("Hiện chưa có phòng thuộc loại bạn chọn. Vui lòng thử loại phòng khác.")
        setBooking({ step: 0, name: "", email: "", phone: "", checkIn: "", checkOut: "" })
        return
      }
      const ci2 = new Date(data.checkIn).getTime()
      const co2 = new Date(data.checkOut).getTime()
      let chosen = undefined as undefined | (typeof sameType)[number]
      // If user picked a specific room earlier, validate it first
      const preferred = data.roomId ? sameType.find((r) => String(r.id) === String(data.roomId)) : undefined
      const searchOrder = preferred ? [preferred, ...sameType.filter((r) => r !== preferred)] : sameType
      for (const r of searchOrder) {
        try {
          const bookings = await findDatPhongByPhong(Number(r.id))
          const clash = bookings.some((dp) => {
            if (!dp.ngayDat || !dp.ngayTra) return false
            const status = (dp.trangThai || "").toLowerCase()
            if (status.includes("hủy")) return false
            return isOverlap(data.checkIn, data.checkOut, dp.ngayDat, dp.ngayTra)
          })
          if (!clash) {
            chosen = r
            break
          }
        } catch {
          // nếu lỗi API, bỏ qua phòng này
        }
      }
      if (!chosen) {
        reply("Khoảng ngày đã kín cho loại phòng này hoặc phòng bạn chọn đã bận. Vui lòng chọn ngày khác hoặc chọn phòng khác.")
        setBooking({ step: 2, name: data.name, email: data.email, phone: data.phone, checkIn: "", checkOut: "", roomTypeId: data.roomTypeId })
        return
      }

      // 3) Tạo đặt phòng
      const payload = {
        idPhong: Number(chosen.id),
        idKh: Number(customerId),
        ngayDat: data.checkIn,
        ngayTra: data.checkOut,
        trangThai: "Chờ xử lý",
      }
      const result: DatPhongDTO = await createDatPhong(payload)

      reply(`Đặt phòng thành công! Mã đặt phòng #${result.idDatPhong}. Phòng: ${chosen.name} (${roomTypeNameById[String(chosen.roomTypeId)] || ""}).\nBạn có thể thanh toán ngay tại /checkout?datPhongId=${result.idDatPhong}`)
      setCheckoutBookingId(result.idDatPhong || null)
      setBooking({ step: 0, name: "", email: "", phone: "", checkIn: "", checkOut: "" })
    } catch (e: any) {
      reply(`Xin lỗi, đặt phòng chưa thành công: ${e?.message || "Lỗi không xác định"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        aria-label="AI Chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bottom-6 right-6 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed z-50 bottom-24 right-6 w-[min(92vw,380px)] max-h-[85vh]">
          <Card className="shadow-xl max-h-[85vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trợ lý đặt phòng</CardTitle>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col overflow-auto">
              <div ref={listRef} className={`overflow-y-auto space-y-3 mb-3 pr-1 h-72`}>
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <div
                      className={
                        m.role === "user"
                          ? "inline-block rounded-xl bg-blue-600 text-white px-3 py-2"
                          : "inline-block rounded-xl bg-slate-100 text-slate-800 px-3 py-2"
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Booking quick picker (chọn loại phòng nhanh) */}
              {booking.step === 1 && roomTypes.length > 0 && (
                <div className="mb-3">
                  <Select onValueChange={(v) => handleBookingFlow(roomTypeNameById[v] || "") }>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Checkout CTA after booking success */}
              {checkoutBookingId != null && (
                <div className="mb-3 flex items-center justify-between gap-2 rounded-md border bg-blue-50 p-2">
                  <div className="text-sm text-blue-800">Bạn có thể thanh toán ngay.</div>
                  <Button size="sm" onClick={() => (window.location.href = `/checkout?datPhongId=${checkoutBookingId}`)}>Thanh toán ngay</Button>
                </div>
              )}

              {/* Mini calendar for re-picking dates when conflict */}
              {booking.step === 2 && booking.roomTypeId && (
                <div className="mb-3 rounded-md border p-2 sticky top-0 bg-white z-10">
                  <div className="text-sm font-medium mb-1">Nhập khoảng ngày</div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Từ (dd/mm/yyyy hoặc yyyy-mm-dd)" value={manualFrom} onChange={(e)=>setManualFrom(e.target.value)} />
                    <Input placeholder="Đến (dd/mm/yyyy hoặc yyyy-mm-dd)" value={manualTo} onChange={(e)=>setManualTo(e.target.value)} />
                    <Button size="sm" onClick={() => {
                      const from = parseDate(manualFrom)
                      const to = parseDate(manualTo)
                      if (!from || !to) {
                        reply("Ngày nhập chưa đúng định dạng. Vui lòng nhập dd/mm/yyyy hoặc yyyy-mm-dd.")
                        return
                      }
                      // Validate không chứa ngày bị full
                      let d = new Date(from)
                      const end = new Date(to)
                      while (d <= end) {
                        const key = d.toISOString().slice(0, 10)
                        if (unavailableSet.has(key)) {
                          reply("Khoảng chọn chứa ngày đã kín. Vui lòng chọn khoảng khác.")
                          return
                        }
                        d.setDate(d.getDate() + 1)
                      }
                      setBooking((prev) => ({ ...prev, step: 3, checkIn: from, checkOut: to }))
                      reply(`Đã chọn: ${formatVN(from)} → ${formatVN(to)}. Vui lòng nhập họ tên để tiếp tục.`)
                    }}>OK</Button>
                  </div>
                </div>
              )}

              {/* Danh sách phòng và lịch đang đặt của từng phòng (giống trang booking) */}
              {booking.step === 2 && roomsOfChosenType.length > 0 && (
                <div className="mb-3 rounded-md border p-2 max-h-52 overflow-auto">
                  <div className="text-sm font-medium mb-2">Chọn phòng khả dụng</div>
                  <div className="space-y-2">
                    {roomsOfChosenType.map((r) => {
                      const bookings = roomBookings[r.id] || []
                      // nếu đã chọn khoảng ngày, disable phòng trùng lịch
                      let disabled = false
                      if (booking.checkIn && booking.checkOut) {
                        disabled = bookings.some((b) => isOverlap(booking.checkIn, booking.checkOut, b.start, b.end))
                      }
                      return (
                        <div key={r.id} className={`p-2 border rounded ${disabled ? 'opacity-60' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{r.name}</div>
                            <Button size="sm" variant="outline" disabled={disabled} onClick={() => {
                              setSelectedRoomId(r.id)
                              // chuyển sang bước nhập thông tin cá nhân
                              if (booking.checkIn && booking.checkOut) {
                                setBooking((prev) => ({ ...prev, step: 3, roomId: r.id }))
                                reply("Vui lòng nhập họ tên để tiếp tục.")
                              } else {
                                reply("Bạn cần chọn khoảng ngày trên lịch trước.")
                              }
                            }}>Chọn</Button>
                          </div>
                          {bookings.length > 0 && (
                            <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                              {bookings.slice(0,6).map((b, i) => (
                                <div key={i} className="bg-slate-50 rounded px-1 py-0.5">{formatVN(b.start)} → {formatVN(b.end)}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  placeholder={loading ? "Đang xử lý..." : "Nhập tin nhắn..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                />
                <Button onClick={() => handleSend()} disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi
                </Button>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">Demo chatbot: trả lời cơ bản và hỗ trợ đặt phòng.</div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}


