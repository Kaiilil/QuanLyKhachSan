"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { getCurrentUser, validateAndSyncSession } from "@/lib/db"

export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      let current = getCurrentUser()
      if (!current) {
        await validateAndSyncSession()
        current = getCurrentUser()
      }
      if (!mounted) return
      setUser(current)
      setReady(true)
    }
    init()

    const onStorage = () => {
      if (!mounted) return
      setUser(getCurrentUser())
    }

    if (typeof window !== 'undefined') {
      window.addEventListener("storage", onStorage)
    }

    return () => {
      mounted = false
      if (typeof window !== 'undefined') {
        window.removeEventListener("storage", onStorage)
      }
    }
  }, [])

  return { user, isAdmin: user?.role === "ADMIN", ready }
}
