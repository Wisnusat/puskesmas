"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  Building2,
  Database,
  FileText,
  Settings,
  TrendingUp,
  UserCheck,
  Package,
  AlertTriangle,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard")

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: activeView === "dashboard",
      onClick: () => setActiveView("dashboard"),
    },
    { icon: Users, label: "Manajemen User", active: activeView === "users", onClick: () => setActiveView("users") },
    {
      icon: Building2,
      label: "Manajemen Puskesmas",
      active: activeView === "hospital",
      onClick: () => setActiveView("hospital"),
    },
    { icon: Database, label: "Data Master", active: activeView === "master", onClick: () => setActiveView("master") },
    { icon: FileText, label: "Laporan", active: activeView === "reports", onClick: () => setActiveView("reports") },
    {
      icon: Settings,
      label: "Pengaturan Sistem",
      active: activeView === "settings",
      onClick: () => setActiveView("settings"),
    },
  ]

  const stats = [
    {
      title: "Total Pasien Hari Ini",
      value: "47",
      change: "+12%",
      trend: "up",
      icon: UserCheck,
      color: "text-blue-600",
    },
    {
      title: "Pendapatan Hari Ini",
      value: "Rp 2.350.000",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Stok Obat Kritis",
      value: "5",
      change: "Perlu Perhatian",
      trend: "warning",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "User Aktif",
      value: "12",
      change: "Online",
      trend: "stable",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const recentActivities = [
    { time: "10:30", activity: "Pasien baru terdaftar - Budi Santoso", type: "registration" },
    { time: "10:15", activity: "Resep obat diproses - RM001235", type: "prescription" },
    { time: "09:45", activity: "Pemeriksaan selesai - dr. Budi", type: "examination" },
    { time: "09:30", activity: "Stok Paracetamol menipis", type: "alert" },
    { time: "09:00", activity: "Shift perawat dimulai", type: "system" },
  ]

  const lowStockMedicines = [
    { name: "Paracetamol 500mg", stock: 15, minimum: 50, status: "critical" },
    { name: "Amoxicillin 500mg", stock: 25, minimum: 30, status: "warning" },
    { name: "OBH Combi", stock: 8, minimum: 20, status: "critical" },
    { name: "Antasida", stock: 35, minimum: 40, status: "warning" },
    { name: "Vitamin B Complex", stock: 12, minimum: 25, status: "critical" },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p
                      className={`text-sm ${
                        stat.trend === "up"
                          ? "text-green-600"
                          : stat.trend === "warning"
                            ? "text-orange-600"
                            : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas sistem dalam 2 jam terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 w-12">{activity.time}</div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.activity}</p>
                  </div>
                  <Badge
                    variant={
                      activity.type === "alert"
                        ? "destructive"
                        : activity.type === "registration"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Stok Obat Menipis
            </CardTitle>
            <CardDescription>Obat yang perlu segera direstok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockMedicines.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-600">Minimum: {medicine.minimum}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${medicine.status === "critical" ? "text-red-600" : "text-orange-600"}`}>
                      {medicine.stock}
                    </p>
                    <Badge variant={medicine.status === "critical" ? "destructive" : "secondary"}>
                      {medicine.status === "critical" ? "Kritis" : "Peringatan"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "users":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Manajemen User</CardTitle>
              <CardDescription>Kelola data dokter, perawat, dan apoteker</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur manajemen user akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "hospital":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Puskesmas</CardTitle>
              <CardDescription>Kelola profil, jadwal, dan fasilitas puskesmas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur manajemen puskesmas akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "master":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Data Master</CardTitle>
              <CardDescription>Kelola data poli, obat, dan penyakit</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur data master akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "reports":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Laporan</CardTitle>
              <CardDescription>Generate laporan kunjungan, keuangan, dan persediaan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur laporan akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Sistem</CardTitle>
              <CardDescription>Konfigurasi sistem umum</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur pengaturan akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <DashboardLayout title="Dashboard Admin" role="admin" sidebarItems={sidebarItems}>
      {renderContent()}
    </DashboardLayout>
  )
}
