const canUseStorage = typeof window !== "undefined"

export function readJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (!canUseStorage) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(value) }))
  } catch {}
}

let counter = 0
export function uid(prefix = "id") {
  // Use a counter for SSR consistency, only add timestamp on client
  if (typeof window !== 'undefined') {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
  }
  return `${prefix}_${++counter}`
}
