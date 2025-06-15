"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BuyerOrders } from "@/components/buyer-orders"
import { FullPageLoader } from "@/components/ui/loading-spinner"

export default function BuyerOrdersPage() {
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
    return <FullPageLoader />
  }

  if (!isAuthenticated || user?.role !== "buyer") {
    return <FullPageLoader />
  }

  return <BuyerOrders />
}
