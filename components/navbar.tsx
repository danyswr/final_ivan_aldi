
"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, Package, LogOut, Menu, X, Bell, User, Store } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  onSearch?: (query: string) => void
}

export function Navbar({ onSearch }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-glow group-hover:scale-105 transition-all duration-300">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold gradient-text">UPJ Katering</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href={user?.role === "buyer" ? "/buyer" : "/seller"}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  pathname === (user?.role === "buyer" ? "/buyer" : "/seller")
                    ? "gradient-primary text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Store className="w-4 h-4 mr-2 inline" />
                Dashboard
              </Link>

              {user?.role === "buyer" && (
                <Link
                  href="/buyer/orders"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                    pathname === "/buyer/orders"
                      ? "gradient-secondary text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Pesanan
                </Link>
              )}
            </div>
          )}

          {/* Search Bar */}
          {isAuthenticated && user?.role === "buyer" && (
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari produk, kategori, atau penjual..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 input-modern"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 rounded-xl">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs gradient-danger border-2 border-white animate-pulse"
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">{user?.fullName || "User"}</div>
                    <div className="text-xs text-gray-500 capitalize flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${user?.role === "buyer" ? "bg-blue-500" : "bg-green-500"} animate-pulse`}
                      ></div>
                      {user?.role}
                    </div>
                  </div>

                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <User className="h-5 w-5 text-white" />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth?mode=login">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-xl">
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth?mode=register">
                  <Button size="sm" className="btn-modern">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 space-y-2 glass">
            {isAuthenticated && (
              <>
                <Link
                  href={user?.role === "buyer" ? "/buyer" : "/seller"}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === (user?.role === "buyer" ? "/buyer" : "/seller")
                      ? "gradient-primary text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Store className="inline-block w-4 h-4 mr-2" />
                  Dashboard
                </Link>

                {user?.role === "buyer" && (
                  <>
                    <Link
                      href="/buyer/orders"
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        pathname === "/buyer/orders"
                          ? "gradient-secondary text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="inline-block w-4 h-4 mr-2" />
                      Pesanan
                    </Link>

                    {/* Mobile Search */}
                    <div className="px-4 py-2">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Cari produk..."
                          value={searchQuery}
                          onChange={handleSearch}
                          className="w-full pl-12 input-modern"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
