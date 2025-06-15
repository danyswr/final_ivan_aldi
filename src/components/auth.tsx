"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { makeAPICall } from "@/lib/api"
import { insertUserSchema, loginUserSchema, type InsertUser, type LoginUser } from "@/lib/schema"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag, User, Mail, Lock, Phone, GraduationCap, UserCheck } from "lucide-react"

export function Auth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login } = useAuth()

  // Get mode and role from URL params
  const initialMode = searchParams.get("mode") || "login"
  const initialRole = searchParams.get("role") || ""

  const [mode, setMode] = useState<"login" | "register">(initialMode as "login" | "register")

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      nomorHp: "",
      jurusan: "",
      role: (initialRole as "buyer" | "seller") || undefined,
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      console.log("Login attempt with:", data.email)
      return makeAPICall({
        sheet: "Users",
        action: "login",
        email: data.email,
        password: data.password,
      })
    },
    onSuccess: (response) => {
      console.log("Login response:", response)

      if (response.success) {
        const userData = {
          userId: response.data?.userId || response.data?.email || loginForm.getValues("email"),
          email: response.data?.email || loginForm.getValues("email"),
          fullName: response.data?.fullName || response.data?.email || "User",
          nomorHp: response.data?.nomorHp || "",
          jurusan: response.data?.jurusan || "",
          role: response.data?.role as "buyer" | "seller",
          createdAt: response.data?.createdAt || new Date().toISOString(),
          updatedAt: response.data?.updatedAt || new Date().toISOString(),
        }

        console.log("Setting user data:", userData)
        login(userData)

        toast({
          title: "Login berhasil!",
          description: `Selamat datang kembali, ${userData.fullName}`,
        })

        // Role-based redirection
        const redirectPath = userData.role === "buyer" ? "/buyer" : "/seller"
        console.log("Redirecting to:", redirectPath)
        router.push(redirectPath)
      } else {
        console.error("Login failed:", response.error)
        toast({
          title: "Login gagal",
          description: response.error || "Email atau password salah",
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      console.error("Login error:", error)
      toast({
        title: "Login gagal",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      console.log("Register attempt with:", data.email, data.role)
      return makeAPICall({
        sheet: "Users",
        action: "register",
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        nomorHp: data.nomorHp,
        jurusan: data.jurusan,
        role: data.role,
      })
    },
    onSuccess: (response) => {
      console.log("Register response:", response)

      if (response.success) {
        const userData = {
          userId: response.data?.userId || response.data?.email || registerForm.getValues("email"),
          email: response.data?.email || registerForm.getValues("email"),
          fullName: response.data?.fullName || registerForm.getValues("fullName"),
          nomorHp: response.data?.nomorHp || registerForm.getValues("nomorHp") || "",
          jurusan: response.data?.jurusan || registerForm.getValues("jurusan") || "",
          role: response.data?.role || registerForm.getValues("role"),
          createdAt: response.data?.createdAt || new Date().toISOString(),
          updatedAt: response.data?.updatedAt || new Date().toISOString(),
        }

        console.log("Setting user data:", userData)
        login(userData)

        toast({
          title: "Registrasi berhasil!",
          description: `Selamat datang, ${userData.fullName}!`,
        })

        // Role-based redirection
        const redirectPath = userData.role === "buyer" ? "/buyer" : "/seller"
        console.log("Redirecting to:", redirectPath)
        router.push(redirectPath)
      } else {
        console.error("Register failed:", response.error)
        toast({
          title: "Registrasi gagal",
          description: response.error || "Terjadi kesalahan saat mendaftar",
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      console.error("Register error:", error)
      toast({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
        variant: "destructive",
      })
    },
  })

  const onLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  const onRegisterSubmit = registerForm.handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Card className="w-full max-w-md relative glass shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold gradient-text">
              {mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {mode === "login"
                ? "Selamat datang kembali! Silakan masuk ke akun Anda."
                : "Bergabunglah dengan UPJ Katering dan mulai berjualan atau berbelanja."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {mode === "login" ? (
            <form onSubmit={onLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="input-modern"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="input-modern"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full btn-modern" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Masuk
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-primary font-medium hover:underline transition-colors"
                  >
                    Daftar disini
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={onRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Nama lengkap"
                    className="input-modern"
                    {...registerForm.register("fullName")}
                  />
                  {registerForm.formState.errors.fullName && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomorHp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    No. HP
                  </Label>
                  <Input
                    id="nomorHp"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    className="input-modern"
                    {...registerForm.register("nomorHp")}
                  />
                  {registerForm.formState.errors.nomorHp && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.nomorHp.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="input-modern"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="input-modern"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurusan" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Jurusan
                </Label>
                <Input
                  id="jurusan"
                  placeholder="Contoh: Teknik Informatika"
                  className="input-modern"
                  {...registerForm.register("jurusan")}
                />
                {registerForm.formState.errors.jurusan && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.jurusan.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Daftar Sebagai
                </Label>
                <Select
                  value={registerForm.watch("role")}
                  onValueChange={(value) => registerForm.setValue("role", value as "buyer" | "seller")}
                >
                  <SelectTrigger className="input-modern">
                    <SelectValue placeholder="Pilih peran Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">🛒 Pembeli - Saya ingin berbelanja</SelectItem>
                    <SelectItem value="seller">🏪 Penjual - Saya ingin berjualan</SelectItem>
                  </SelectContent>
                </Select>
                {registerForm.formState.errors.role && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.role.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full btn-modern" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Daftar Sekarang
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary font-medium hover:underline transition-colors"
                  >
                    Masuk disini
                  </button>
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
