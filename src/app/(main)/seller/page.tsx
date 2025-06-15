"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SellerDashboard } from "@/components/seller-dashboard"

export default function SellerPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else if (user?.role !== "seller") {
        router.push("/buyer")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "seller") {
    return null
  }

  return <SellerDashboard />
}
