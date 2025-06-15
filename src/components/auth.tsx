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
import { 
  ShoppingBag, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  GraduationCap, 
  UserCheck, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles,
  Users,
  ShoppingCart
} from "lucide-react"

export function Auth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login } = useAuth()

  // Get mode and role from URL params
  const initialMode = searchParams.get("mode") || "login"
  const initialRole = searchParams.get("role") || ""

  const [mode, setMode] = useState<"login" | "register">(initialMode as "login" | "register")
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div 
          className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div 
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-10 text-blue-400/20 animate-float hidden lg:block">
          <Sparkles className="h-8 w-8" />
        </div>
        <div 
          className="absolute top-1/3 right-10 text-purple-400/20 animate-float hidden lg:block"
          style={{ animationDelay: "3s" }}
        >
          <Users className="h-6 w-6" />
        </div>
        <div 
          className="absolute bottom-1/4 right-1/4 text-pink-400/20 animate-float hidden lg:block"
          style={{ animationDelay: "1s" }}
        >
          <ShoppingCart className="h-7 w-7" />
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-2xl relative z-10">
        <Card className="glass shadow-2xl border-0 overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          {/* Header Section */}
          <CardHeader className="relative text-center space-y-8 p-8 lg:p-10 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 lg:w-28 lg:h-28 gradient-primary rounded-3xl flex items-center justify-center shadow-xl transform transition-all duration-300 hover:rotate-12 hover:scale-110">
                  <ShoppingBag className="h-12 w-12 lg:h-14 lg:w-14 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <CardTitle className="text-3xl lg:text-4xl font-bold gradient-text">
                {mode === "login" ? "Selamat Datang Kembali" : "Bergabung Dengan Kami"}
              </CardTitle>
              <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
                {mode === "login"
                  ? "Masuk ke akun Anda dan lanjutkan berbelanja"
                  : "Daftar sekarang dan mulai berjualan atau berbelanja"}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-3 px-6 rounded-xl text-base font-semibold transition-all duration-300 ${
                  mode === "login"
                    ? "bg-white shadow-lg text-blue-600 transform scale-105"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-3 px-6 rounded-xl text-base font-semibold transition-all duration-300 ${
                  mode === "register"
                    ? "bg-white shadow-lg text-blue-600 transform scale-105"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Daftar
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-8 lg:p-10 space-y-8">
            {mode === "login" ? (
              <form onSubmit={onLoginSubmit} className="space-y-8">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                    <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan alamat email Anda"
                      className="w-full h-14 text-base pl-6 pr-6 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50 hover:shadow-md focus:shadow-lg"
                      {...loginForm.register("email")}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                    <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                      <Lock className="h-3 w-3 text-white" />
                    </div>
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      className="w-full h-14 text-base pl-6 pr-16 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50 hover:shadow-md focus:shadow-lg"
                      {...loginForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300 p-1"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6" />
                      <span>Masuk ke Akun</span>
                      <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={onRegisterSubmit} className="space-y-7">
                {/* Name and Phone Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                      <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      Nama Lengkap
                    </Label>
                    <div className="relative group">
                      <Input
                        id="fullName"
                        placeholder="Masukkan nama lengkap"
                        className="w-full h-14 text-base pl-6 pr-6 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50 hover:shadow-md focus:shadow-lg"
                        {...registerForm.register("fullName")}
                      />
                    </div>
                    {registerForm.formState.errors.fullName && (
                      <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {registerForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="nomorHp" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                      <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                        <Phone className="h-3 w-3 text-white" />
                      </div>
                      Nomor HP
                    </Label>
                    <div className="relative group">
                      <Input
                        id="nomorHp"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        className="w-full h-14 text-base pl-6 pr-6 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50 hover:shadow-md focus:shadow-lg"
                        {...registerForm.register("nomorHp")}
                      />
                    </div>
                    {registerForm.formState.errors.nomorHp && (
                      <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {registerForm.formState.errors.nomorHp.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                    <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan alamat email"
                      className="w-full h-14 text-base pl-6 pr-6 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50 hover:shadow-md focus:shadow-lg"
                      {...registerForm.register("email")}
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                    <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                      <Lock className="h-3 w-3 text-white" />
                    </div>
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      className="w-full h-14 text-base pl-6 pr-16 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50 hover:shadow-md focus:shadow-lg"
                      {...registerForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300 p-1"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Jurusan Field */}
                <div className="space-y-3">
                  <Label htmlFor="jurusan" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                    <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                      <GraduationCap className="h-3 w-3 text-white" />
                    </div>
                    Jurusan
                  </Label>
                  <div className="relative group">
                    <Input
                      id="jurusan"
                      placeholder="Contoh: Teknik Informatika"
                      className="w-full h-14 text-base pl-6 pr-6 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50 hover:shadow-md focus:shadow-lg"
                      {...registerForm.register("jurusan")}
                    />
                  </div>
                  {registerForm.formState.errors.jurusan && (
                    <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {registerForm.formState.errors.jurusan.message}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label htmlFor="role" className="flex items-center gap-3 text-gray-700 font-semibold text-base">
                    <div className="w-5 h-5 gradient-primary rounded-md flex items-center justify-center">
                      <UserCheck className="h-3 w-3 text-white" />
                    </div>
                    Daftar Sebagai
                  </Label>
                  <Select
                    value={registerForm.watch("role")}
                    onValueChange={(value) => registerForm.setValue("role", value as "buyer" | "seller")}
                  >
                    <SelectTrigger className="w-full h-14 text-base pl-6 pr-6 bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 hover:border-blue-400/50">
                      <SelectValue placeholder="Pilih peran Anda" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl">
                      <SelectItem value="buyer" className="text-base py-4 cursor-pointer hover:bg-blue-50 transition-colors rounded-lg m-1">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Pembeli</div>
                            <div className="text-sm text-gray-500">Saya ingin berbelanja</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="seller" className="text-base py-4 cursor-pointer hover:bg-green-50 transition-colors rounded-lg m-1">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Penjual</div>
                            <div className="text-sm text-gray-500">Saya ingin berjualan</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {registerForm.formState.errors.role && (
                    <p className="text-sm text-red-500 flex items-center gap-2 animate-in slide-in-from-left-1 bg-red-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {registerForm.formState.errors.role.message}
                    </p>
                  )}
                </div>

                {/* Register Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Mendaftarkan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-6 w-6" />
                      <span>Daftar Sekarang</span>
                      <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200/50">
              <p className="text-gray-600 text-base">
                {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 hover:underline"
                >
                  {mode === "login" ? "Daftar sekarang" : "Masuk di sini"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Decoration */}
        <div className="flex justify-center mt-8 space-x-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
      </div>
    </div>
  )
}
