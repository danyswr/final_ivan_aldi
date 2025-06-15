"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BuyerDashboard } from "@/components/buyer-dashboard"
import { FullPageLoader } from "@/components/ui/loading-spinner"

export default function BuyerPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("Buyer page - Auth state:", { user, isAuthenticated, isLoading })

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to auth")
        router.push("/auth")
      } else if (user?.role !== "buyer") {
        console.log("User is not buyer, role:", user?.role, "redirecting to seller")
        router.push("/seller")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!isAuthenticated || user?.role !== "buyer") {
    return <FullPageLoader />
  }

  return <BuyerDashboard />
}
