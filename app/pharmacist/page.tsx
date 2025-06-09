"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  Package,
  Pill,
  TrendingDown,
  AlertTriangle,
  UserCircle,
  Clock,
  CheckCircle,
} from "lucide-react"

export default function PharmacistDashboard() {
  const [activeView, setActiveView] = useState("dashboard")

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: activeView === "dashboard",
      onClick: () => setActiveView("dashboard"),
    },
    {
      icon: FileText,
      label: "Resep Masuk",
      active: activeView === "prescriptions",
      onClick: () => setActiveView("prescriptions"),
    },
    {
      icon: Pill,
      label: "Dispensing Obat",
      active: activeView === "dispensing",
      onClick: () => setActiveView("dispensing"),
    },
    { icon: Package, label: "Kelola Stok Obat", active: activeView === "stock", onClick: () => setActiveView("stock") },
    {
      icon: TrendingDown,
      label: "Laporan Obat",
      active: activeView === "reports",
      onClick: () => setActiveView("reports"),
    },
    {
      icon: AlertTriangle,
      label: "Stok Menipis",
      active: activeView === "alerts",
      onClick: () => setActiveView("alerts"),
    },
    {
      icon: UserCircle,
      label: "Profil Saya",
      active: activeView === "profile",
      onClick: () => setActiveView("profile"),
    },
  ]

  const todayStats = {
    pendingPrescriptions: 8,
    dispensedToday: 25,
    lowStockItems: 5,
    totalSales: 1850000,
  }

  const pendingPrescriptions = [
    {
      id: "RX001",
      patientName: "Dewi Sari",
      doctor: "dr. Budi Santoso",
      time: "10:45",
      medicines: ["Paracetamol 500mg", "Amoxicillin 500mg"],
      status: "pending",
    },
    {
      id: "RX002",
      patientName: "Rudi Hartono",
      doctor: "dr. Ahmad Sehat",
      time: "10:30",
      medicines: ["Metformin 500mg", "Captopril 25mg"],
      status: "processing",
    },
    {
      id: "RX003",
      patientName: "Maya Sari",
      doctor: "dr. Budi Santoso",
      time: "10:15",
      medicines: ["Ibuprofen 400mg", "Vitamin B Complex"],
      status: "ready",
    },
  ]

  const lowStockMedicines = [
    { name: "Paracetamol 500mg", currentStock: 15, minStock: 50, status: "critical" },
    { name: "Amoxicillin 500mg", currentStock: 25, minStock: 30, status: "warning" },
    { name: "OBH Combi", currentStock: 8, minStock: 20, status: "critical" },
    { name: "Antasida", currentStock: 35, minStock: 40, status: "warning" },
    { name: "Vitamin B Complex", currentStock: 12, minStock: 25, status: "critical" },
  ]

  const recentDispensing = [
    { time: "10:30", patient: "Ahmad Fauzi", medicines: "Antasida, Domperidone", amount: "Rp 45.000" },
    { time: "10:15", patient: "Siti Aminah", medicines: "Ibuprofen, Vitamin B", amount: "Rp 32.000" },
    { time: "10:00", patient: "Budi Santoso", medicines: "Paracetamol, OBH", amount: "Rp 28.000" },
    { time: "09:45", patient: "Dewi Lestari", medicines: "Amoxicillin", amount: "Rp 55.000" },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resep Pending</p>
                <p className="text-2xl font-bold text-orange-600">{todayStats.pendingPrescriptions}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Obat Diserahkan</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.dispensedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stok Kritis</p>
                <p className="text-2xl font-bold text-red-600">{todayStats.lowStockItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Penjualan Hari Ini</p>
                <p className="text-2xl font-bold">Rp {todayStats.totalSales.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Resep Menunggu</CardTitle>
            <CardDescription>Resep yang perlu diproses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPrescriptions.map((prescription, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{prescription.patientName}</p>
                      <p className="text-sm text-gray-600">
                        {prescription.doctor} | {prescription.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        prescription.status === "ready"
                          ? "default"
                          : prescription.status === "processing"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {prescription.status === "ready"
                        ? "Siap"
                        : prescription.status === "processing"
                          ? "Diproses"
                          : "Pending"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Obat: {prescription.medicines.join(", ")}</p>
                  </div>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    {prescription.status === "ready" ? "Serahkan Obat" : "Proses Resep"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
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
                    <p className="text-sm text-gray-600">
                      Min: {medicine.minStock} | Sisa: {medicine.currentStock}
                    </p>
                  </div>
                  <Badge variant={medicine.status === "critical" ? "destructive" : "secondary"}>
                    {medicine.status === "critical" ? "Kritis" : "Peringatan"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Dispensing */}
      <Card>
        <CardHeader>
          <CardTitle>Penyerahan Obat Terbaru</CardTitle>
          <CardDescription>Riwayat penyerahan obat hari ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDispensing.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-500 w-12">{item.time}</div>
                  <div>
                    <p className="font-medium">{item.patient}</p>
                    <p className="text-sm text-gray-600">{item.medicines}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{item.amount}</p>
                  <Badge variant="default">Selesai</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "prescriptions":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Resep Masuk</CardTitle>
              <CardDescription>Daftar resep dari dokter yang perlu dilayani</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur resep masuk akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "dispensing":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Dispensing Obat</CardTitle>
              <CardDescription>Proses penyerahan obat ke pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur dispensing obat akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "stock":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Kelola Stok Obat</CardTitle>
              <CardDescription>Input, edit, hapus data obat dan stok</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur kelola stok akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "reports":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Laporan Obat</CardTitle>
              <CardDescription>Laporan pemakaian dan penjualan obat</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur laporan obat akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "alerts":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Stok Menipis</CardTitle>
              <CardDescription>Monitoring obat yang stoknya menipis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockMedicines.map((medicine, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{medicine.name}</p>
                      <p className="text-sm text-gray-600">
                        Stok saat ini: {medicine.currentStock} | Minimum: {medicine.minStock}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={medicine.status === "critical" ? "destructive" : "secondary"}>
                        {medicine.status === "critical" ? "Kritis" : "Peringatan"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Buat PO
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profil Saya</CardTitle>
              <CardDescription>Edit data pribadi</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur profil akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <DashboardLayout title="Dashboard Apoteker" role="pharmacist" sidebarItems={sidebarItems}>
      {renderContent()}
    </DashboardLayout>
  )
}
