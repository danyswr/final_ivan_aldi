"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import { OrderDetailModal } from "@/components/order-detail-modal"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { makeAPICall, formatPrice } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Plus, Package, ShoppingCart, Store, Users, DollarSign } from "lucide-react"

export function SellerDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any[] | null>(null)
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any[] | null>(null)

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      if (!user) return { success: false, data: [] }
      return makeAPICall(
        {
          email: user.email,
          action: "read",
        },
        "products",
      )
    },
    enabled: !!user,
  })

  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      if (!user) return { success: false, data: [] }
      return makeAPICall(
        {
          email: user.email,
          action: "read",
        },
        "orders",
      )
    },
    enabled: !!user,
  })

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return makeAPICall(
        {
          email: user?.email,
          action: "delete",
          product_id: productId,
        },
        "products",
      )
    },
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Produk berhasil dihapus!",
          description: "Produk telah dihapus dari katalog",
        })
        queryClient.invalidateQueries({ queryKey: ["/api/products"] })
      } else {
        toast({
          title: "Gagal menghapus produk",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    },
    onError: () => {
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk",
        variant: "destructive",
      })
    },
  })

  const processOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string
      status: string
    }) => {
      console.log("Processing order:", orderId, "with status:", status)

      const payload = {
        email: user?.email,
        action: "update",
        order_id: orderId,
        order_status: status,
      }

      console.log("Order update payload:", payload)
      const response = await makeAPICall(payload, "orders")
      console.log("Order update API response:", response)

      if (!response.success) {
        throw new Error(response.error || "Failed to update order status")
      }

      return { ...response, requestedStatus: status }
    },
    onSuccess: (response) => {
      console.log("Order update successful:", response)
      const statusText = response.requestedStatus === "confirmed" ? "dikonfirmasi" : "ditolak"
      toast({
        title: "Pesanan berhasil diproses!",
        description: `Status pesanan berhasil diubah menjadi ${statusText}`,
      })
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] })
    },
    onError: (error: any) => {
      console.error("Order update error:", error)
      toast({
        title: "Gagal memproses pesanan",
        description:
          error.message ||
          "Terjadi kesalahan saat memproses pesanan. Pastikan Google Apps Script sudah diperbarui dengan fitur update orders.",
        variant: "destructive",
      })
    },
  })

  const products = productsResponse?.success ? productsResponse.data : []
  const orders = ordersResponse?.success ? ordersResponse.data : []

  const currentEmail = user?.email

  // Filter products for current seller
  const sellerProducts = products.filter((product: any[]) => {
    const productUserId = product[1] // user_id is at index 1
    return productUserId === currentEmail
  })

  // Filter orders for this seller
  const sellerOrders = orders.filter((order: any[]) => {
    const sellerId = order[2] // seller_id is at index 2
    return sellerId === currentEmail
  })

  const stats = {
    totalProducts: sellerProducts.length,
    activeProducts: sellerProducts.filter((p: any[]) => p[8] === 1).length,
    outOfStock: sellerProducts.filter((p: any[]) => p[6] === 0).length,
    totalValue: sellerProducts.reduce((sum: number, p: any[]) => sum + p[5] * p[6], 0),
    totalOrders: sellerOrders.length,
    pendingOrders: sellerOrders.filter((o: any[]) => o[6] === "pending").length,
  }

  const handleAddProduct = () => {
    setEditProduct(null)
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: any[]) => {
    setEditProduct(product)
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteMutation.mutate(productId)
    }
  }

  const handleProcessOrder = (orderId: string, status: string) => {
    if (
      window.confirm(`Apakah Anda yakin ingin ${status === "confirmed" ? "mengkonfirmasi" : "menolak"} pesanan ini?`)
    ) {
      processOrderMutation.mutate({ orderId, status })
    }
  }

  const handleViewOrderDetail = (order: any[]) => {
    setSelectedOrder(order)
    setIsOrderDetailModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="space-y-8 pb-20">
        {/* Modern Hero Header */}
        <div className="relative overflow-hidden glass rounded-3xl p-8 shadow-2xl border-0">
          <div className="absolute inset-0 gradient-success opacity-90"></div>
          <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                    <Store className="h-4 w-4 mr-2" />
                    Dashboard Penjual
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    Selamat Datang, {user?.fullName || "Penjual"}
                  </h1>
                  <p className="text-white/90 text-lg">Kelola produk dan pesanan Anda dengan mudah</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{user?.jurusan || "Universitas"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddProduct}
                  size="lg"
                  className="glass text-white border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Tambah Produk
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="modern-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Produk</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produk Aktif</p>
                <p className="text-3xl font-bold text-foreground">{stats.activeProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pesanan</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nilai Inventory</p>
                <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalValue)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground">Produk Saya</h2>
            <div className="text-sm text-muted-foreground modern-card px-4 py-2">{sellerProducts.length} produk</div>
          </div>

          {sellerProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="modern-card p-12 max-w-md mx-auto">
                <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6 animate-float" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Belum ada produk</h3>
                <p className="text-muted-foreground mb-6">Mulai berjualan dengan menambahkan produk pertama Anda</p>
                <Button onClick={handleAddProduct} className="btn-modern">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid-responsive">
              {sellerProducts.map((product: any[]) => (
                <ProductCard
                  key={product[0]}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  isOwner={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground">Pesanan Masuk</h2>
            <div className="text-sm text-muted-foreground modern-card px-4 py-2">{sellerOrders.length} pesanan</div>
          </div>

          {sellerOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="modern-card p-12 max-w-md mx-auto">
                <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-6 animate-float" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Belum ada pesanan</h3>
                <p className="text-muted-foreground">Pesanan dari pembeli akan muncul di sini</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sellerOrders.map((order: any[]) => {
                const [orderId, buyerId, sellerId, productId, quantity, totalPrice, orderStatus, createdAt] = order
                const product = products.find((p: any[]) => p[0] === productId)
                const productName = product ? product[2] : "Produk tidak ditemukan"

                return (
                  <div key={orderId} className="modern-card p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-foreground">{productName}</h3>
                          <Badge
                            variant={
                              orderStatus === "pending"
                                ? "secondary"
                                : orderStatus === "confirmed"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {orderStatus === "pending"
                              ? "Menunggu"
                              : orderStatus === "confirmed"
                                ? "Dikonfirmasi"
                                : "Ditolak"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Pembeli: {buyerId}</p>
                        <p className="text-sm text-muted-foreground">
                          Jumlah: {quantity} • Total: {formatPrice(totalPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(createdAt).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewOrderDetail(order)}>
                          Detail
                        </Button>
                        {orderStatus === "pending" && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              className="gradient-success text-white"
                              onClick={() => handleProcessOrder(orderId, "confirmed")}
                              disabled={processOrderMutation.isPending}
                            >
                              Konfirmasi
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleProcessOrder(orderId, "cancelled")}
                              disabled={processOrderMutation.isPending}
                            >
                              Tolak
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Product Modal */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false)
            setEditProduct(null)
          }}
          product={editProduct}
        />

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={isOrderDetailModalOpen}
          onClose={() => {
            setIsOrderDetailModalOpen(false)
            setSelectedOrder(null)
          }}
          order={selectedOrder}
          product={selectedOrder ? products.find((p: any[]) => p[0] === selectedOrder[3]) : null}
        />
      </div>
    </div>
  )
}
