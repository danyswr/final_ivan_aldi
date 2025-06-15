"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BuyerDashboard } from "@/components/buyer-dashboard"

export default function BuyerPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else if (user?.role !== "buyer") {
        router.push("/seller")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "buyer") {
    return null
  }

  return <BuyerDashboard />
}
