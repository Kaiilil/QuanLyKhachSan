export function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(
      value,
    )
  } catch {
    return `${value.toLocaleString("vi-VN")} ₫`
  }
}

export function dateDiffNights(checkInISO: string, checkOutISO: string) {
  const inD = new Date(checkInISO)
  const outD = new Date(checkOutISO)
  const ms = outD.getTime() - inD.getTime()
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return Math.max(0, nights)
}

export function toISODate(date: Date) {
  const p = (n: number) => `${n}`.padStart(2, "0")
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
}
