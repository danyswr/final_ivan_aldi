"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SellerDashboard } from "@/components/seller-dashboard"
import { FullPageLoader } from "@/components/ui/loading-spinner"

export default function SellerPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("Seller page - Auth state:", { user, isAuthenticated, isLoading })

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to auth")
        router.push("/auth")
      } else if (user?.role !== "seller") {
        console.log("User is not seller, role:", user?.role, "redirecting to buyer")
        router.push("/buyer")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!isAuthenticated || user?.role !== "seller") {
    return <FullPageLoader />
  }

  return <SellerDashboard />
}
