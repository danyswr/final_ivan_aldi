"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  ShoppingCart,
  TrendingUp,
  Star,
  Shield,
  Zap,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Store,
      title: "Jual Produk Mudah",
      description: "Interface yang intuitif untuk mengelola produk, stok, dan penjualan dengan mudah",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShoppingCart,
      title: "Belanja Aman",
      description: "Sistem keamanan berlapis dan perlindungan pembeli yang terjamin untuk setiap transaksi",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Analitik Bisnis",
      description: "Dashboard komprehensif dengan laporan penjualan dan insight bisnis yang mendalam",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Enkripsi end-to-end dan sistem keamanan tingkat enterprise untuk melindungi data Anda",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Performa Cepat",
      description: "Loading super cepat dan responsif di semua perangkat untuk pengalaman yang optimal",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Komunitas Aktif",
      description: "Bergabung dengan ribuan penjual dan pembeli dalam ekosistem yang saling mendukung",
      gradient: "from-indigo-500 to-blue-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-7xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-5 h-5 text-blue-600 animate-spin-slow" />
              <span className="text-sm font-semibold text-blue-700">Platform E-Commerce Terdepan</span>
              <div className="status-dot status-online"></div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-display">
                <span className="block text-gray-900">Selamat Datang di</span>
                <span className="block gradient-text animate-gradient">UPJ Katering</span>
              </h1>
              <p className="max-w-4xl mx-auto text-xl sm:text-2xl text-gray-600 leading-relaxed">
                Platform marketplace modern yang menghubungkan penjual dan pembeli dengan teknologi terdepan dan
                pengalaman yang luar biasa
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/auth?mode=register&role=seller">
                <Button className="group btn-modern text-lg px-10 py-6 shadow-glow hover:shadow-glow-hover">
                  <Store className="mr-3 h-6 w-6 group-hover:animate-float" />
                  Mulai Berjualan
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button className="btn-outline-modern text-lg px-10 py-6">
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Mulai Berbelanja
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: "1000+", label: "Produk Tersedia", icon: Store },
                { number: "500+", label: "Penjual Aktif", icon: Users },
                { number: "5000+", label: "Transaksi Sukses", icon: TrendingUp },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="modern-card p-8 text-center hover-lift hover-glow group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <Badge className="px-6 py-2 bg-blue-100 text-blue-700 border-blue-200">
              <Award className="w-4 h-4 mr-2" />
              Fitur Unggulan
            </Badge>
            <h2 className="text-heading text-gray-900">Mengapa Memilih Kami?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fitur-fitur unggulan yang membuat pengalaman jual beli Anda lebih mudah dan menyenangkan
            </p>
          </div>

          <div className="grid-responsive-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`modern-card group hover-lift hover-glow cursor-pointer ${
                  index === currentFeature ? "ring-2 ring-blue-500 shadow-glow" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div
                    className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    Premium Feature
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-6 mb-20">
            <Badge className="px-6 py-2 bg-white/20 text-white border-white/30">
              <Star className="w-4 h-4 mr-2" />
              Testimoni Pengguna
            </Badge>
            <h2 className="text-heading text-white">Apa Kata Mereka?</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Testimoni dari para pengguna yang telah merasakan manfaat platform kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmad Santoso",
                role: "Penjual Elektronik",
                avatar: "AS",
                text: "Platform yang sangat mudah digunakan! Dalam seminggu saja penjualan saya meningkat drastis.",
                gradient: "from-blue-500 to-purple-500",
              },
              {
                name: "Siti Rahmawati",
                role: "Pembeli Setia",
                avatar: "SR",
                text: "Belanja di sini sangat aman dan nyaman. Produknya beragam dengan kualitas terjamin.",
                gradient: "from-pink-500 to-red-500",
              },
              {
                name: "Budi Pratama",
                role: "Penjual Fashion",
                avatar: "BP",
                text: "Dashboard analitiknya membantu saya memahami tren penjualan dan mengembangkan bisnis.",
                gradient: "from-green-500 to-teal-500",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="glass-dark text-center p-8 hover-lift">
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-white italic leading-relaxed">"{testimonial.text}"</blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-white/70 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-heading text-white">Siap Memulai Perjalanan Anda?</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Bergabunglah dengan ribuan penjual dan pembeli yang telah merasakan kemudahan platform kami
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth?mode=register&role=seller">
                <Button className="px-12 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl hover:scale-105">
                  <Store className="mr-3 h-6 w-6" />
                  Daftar Sebagai Penjual
                </Button>
              </Link>
              <Link href="/auth?mode=register&role=buyer">
                <Button className="px-12 py-6 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 rounded-2xl hover:scale-105">
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Daftar Sebagai Pembeli
                </Button>
              </Link>
            </div>

            <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-white/90">
              {[
                { icon: CheckCircle, text: "Gratis Selamanya" },
                { icon: CheckCircle, text: "Tanpa Biaya Setup" },
                { icon: CheckCircle, text: "Support 24/7" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
