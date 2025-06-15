
import { z } from "zod"

export const insertUserSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  nomorHp: z.string().min(10, "Nomor HP minimal 10 digit"),
  jurusan: z.string().min(1, "Jurusan wajib diisi"),
  role: z.enum(["buyer", "seller"], {
    required_error: "Role wajib dipilih",
  }),
})

export const loginUserSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
})

export type InsertUser = z.infer<typeof insertUserSchema>
export type LoginUser = z.infer<typeof loginUserSchema>

export interface User {
  userId: string
  email: string
  fullName: string
  nomorHp: string
  jurusan: string
  role: "buyer" | "seller"
  createdAt: string
  updatedAt: string
}

export interface Product {
  productId: string
  userId: string
  name: string
  image: string
  description: string
  price: number
  stock: number
  category: string
  isActive: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  orderId: string
  buyerId: string
  sellerId: string
  productId: string
  quantity: number
  totalPrice: number
  orderStatus: string
  createdAt: string
}
