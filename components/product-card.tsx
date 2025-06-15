
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/api"
import { ShoppingCart, Edit, Trash2, Package, Eye } from "lucide-react"

interface ProductCardProps {
  product: any[]
  onOrder?: (product: any[]) => void
  onEdit?: (product: any[]) => void
  onDelete?: (productId: string) => void
  isOwner?: boolean
}

export function ProductCard({ product, onOrder, onEdit, onDelete, isOwner = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  const [
    productId,
    userId,
    name,
    image,
    description,
    price,
    stock,
    category,
    isActive,
    createdAt,
    updatedAt,
  ] = product

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageUrl = (driveUrl: string) => {
    if (!driveUrl || imageError) return "/placeholder.svg"
    
    // Convert Google Drive share URL to direct image URL
    if (driveUrl.includes("drive.google.com")) {
      const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`
      }
    }
    
    return driveUrl || "/placeholder.svg"
  }

  return (
    <Card className="modern-card group hover-lift hover-glow overflow-hidden h-full">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={getImageUrl(image)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {stock === 0 && (
            <Badge variant="destructive" className="bg-red-500 text-white">
              Habis
            </Badge>
          )}
          {isActive === 0 && (
            <Badge variant="secondary" className="bg-gray-500 text-white">
              Nonaktif
            </Badge>
          )}
          {category && (
            <Badge variant="outline" className="bg-white/90 text-gray-700 border-gray-300">
              {category}
            </Badge>
          )}
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0"
                onClick={() => onDelete(productId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(price)}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{stock} tersisa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {isOwner ? (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                className="px-4"
                disabled
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full btn-modern"
              onClick={() => onOrder?.(product)}
              disabled={stock === 0 || isActive === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {stock === 0 ? "Habis" : "Pesan Sekarang"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
