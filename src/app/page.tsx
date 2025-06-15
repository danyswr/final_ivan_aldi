"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Landing from "@/components/landing"
import { FullPageLoader } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push(user.role === "buyer" ? "/buyer" : "/seller")
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return <FullPageLoader />
  }

  if (isAuthenticated && user) {
    return <FullPageLoader />
  }

  return <Landing />
}
