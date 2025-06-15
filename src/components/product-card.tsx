"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/api"
import { ImageIcon, Edit, Trash2, ShoppingCart, Heart, Star, Eye, Award, TrendingUp } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: any[]
  onOrder?: (product: any[]) => void
  onEdit?: (product: any[]) => void
  onDelete?: (productId: string) => void
  isOwner?: boolean
}

export function ProductCard({ product, onOrder, onEdit, onDelete, isOwner = false }: ProductCardProps) {
  const [productId, userId, productName, imageUrl, description, price, stock, category, status] = product
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isOutOfStock = stock === 0
  const isActive = status === 1
  const isLowStock = stock > 0 && stock <= 5
  const isTrending = Math.random() > 0.7

  const getDirectImageUrl = (url: string) => {
    if (!url) return ""

    if (url.includes("drive.google.com")) {
      let fileId = ""
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
      if (fileIdMatch) {
        fileId = fileIdMatch[1]
      } else {
        const idMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)
        if (idMatch) {
          fileId = idMatch[1]
        }
      }

      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`
      }
    }

    return url
  }

  const directImageUrl = getDirectImageUrl(imageUrl)

  return (
    <Card
      className="group relative overflow-hidden modern-card hover-lift hover-glow cursor-pointer border-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isTrending && (
          <Badge className="gradient-warning text-white border-0 shadow-lg">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
        {!isActive && (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
            Tidak Aktif
          </Badge>
        )}
        {isOutOfStock && <Badge className="gradient-danger text-white border-0">Stok Habis</Badge>}
        {isLowStock && <Badge className="gradient-warning text-white border-0">Terbatas</Badge>}
      </div>

      {/* Favorite button */}
      {!isOwner && (
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 z-10 w-12 h-12 rounded-full glass border border-white/50 shadow-lg ${
            isLiked ? "text-red-500" : "text-gray-600"
          } hover:scale-110 transition-all duration-300`}
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      )}

      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden rounded-t-2xl">
        {directImageUrl ? (
          <img
            src={directImageUrl || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              console.log("Image load error for URL:", directImageUrl)
              e.currentTarget.style.display = "none"
              const placeholder = e.currentTarget.parentElement?.querySelector(".image-placeholder") as HTMLElement
              if (placeholder) {
                placeholder.style.display = "flex"
              }
            }}
            onLoad={(e) => {
              console.log("Image loaded successfully:", directImageUrl)
              const placeholder = e.currentTarget.parentElement?.querySelector(".image-placeholder") as HTMLElement
              if (placeholder) {
                placeholder.style.display = "none"
              }
            }}
            referrerPolicy="no-referrer"
          />
        ) : null}

        <div
          className="w-full h-full flex items-center justify-center image-placeholder bg-gradient-to-br from-gray-100 to-gray-200"
          style={{ display: directImageUrl ? "none" : "flex" }}
        >
          <ImageIcon className="h-20 w-20 text-gray-300" />
        </div>

        {/* Interactive overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-6 gap-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {!isOwner && (
            <>
              <Button
                size="sm"
                className="glass hover:bg-white text-gray-800 border-0 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => {}}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className={`transition-all duration-300 border-0 rounded-xl shadow-lg hover:scale-105 ${
                  isLiked ? "gradient-danger text-white" : "glass hover:bg-white text-gray-800"
                }`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </>
          )}
        </div>

        {/* Stock out overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="gradient-danger text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl">
              Stok Habis
            </div>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute bottom-4 left-4">
            <Badge className="glass border-white/50 text-gray-700 shadow-lg">{category}</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {productName}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{description || "Tidak ada deskripsi"}</p>
        </div>

        {/* Price section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <span className="text-3xl font-bold gradient-text">{formatPrice(price)}</span>
              <div className="text-xs text-gray-500 font-medium">Per item</div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm font-semibold text-gray-700">{stock} tersisa</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stock > 10 ? "gradient-success" : stock > 5 ? "gradient-warning" : "gradient-danger"
                  }`}
                  style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rating stars */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
              <span className="text-sm text-gray-500 ml-2">(4.0)</span>
            </div>
            {isTrending && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                <Award className="w-3 h-3 mr-1" />
                Best Seller
              </Badge>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {isOwner ? (
          <div className="flex space-x-3 pt-2">
            <Button variant="outline" size="lg" className="flex-1 btn-outline-modern" onClick={() => onEdit?.(product)}>
              <Edit className="h-5 w-5 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 text-red-600 border-2 border-red-300 hover:text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-300 rounded-xl"
              onClick={() => onDelete?.(productId)}
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Hapus
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className={`w-full transition-all duration-300 font-bold text-lg py-4 rounded-2xl ${
              !isOutOfStock && isActive
                ? "btn-modern shadow-glow hover:shadow-glow-hover hover:scale-105"
                : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => onOrder?.(product)}
            disabled={isOutOfStock || !isActive}
          >
            <ShoppingCart className="h-6 w-6 mr-3" />
            {isOutOfStock ? "Stok Habis" : !isActive ? "Tidak Tersedia" : "Beli Sekarang"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
