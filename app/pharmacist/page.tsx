/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MedicineForm from "@/components/medicine-form"
import { HospitalStorage } from "@/lib/storage"
import {
  LayoutDashboard,
  FileText,
  Package,
  TrendingDown,
  AlertTriangle,
  UserCircle,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Edit,
  Eye,
  ShoppingCart,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Medicine {
  id: string
  name: string
  stock: number
  minStock: number
  price: number
  unit: string
  category: string
}

interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  medicines: Array<{
    medicineId: string
    medicineName: string
    quantity: number
  }>
  status: "pending" | "dispensed" | "cancelled"
}

export default function PharmacistDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const storage = HospitalStorage.getInstance()

  // Pertama, hapus menu "Dispensing Obat" dari sidebarItems
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

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setPrescriptions(storage.getAll("prescriptions"))
    setMedicines(storage.getAll("medicines"))
  }

  const handleSave = () => {
    setShowForm(false)
    setSelectedItem(null)
    loadData()
  }

  const dispensePrescription = (prescriptionId: string) => {
    const prescription = prescriptions.find((p) => p.id === prescriptionId)
    if (prescription) {
      // Update medicine stock
      prescription.medicines.forEach((medicine: any) => {
        const medicineData = medicines.find((m) => m.id === medicine.medicineId)
        if (medicineData) {
          const newStock = medicineData.stock - medicine.quantity
          storage.update<Medicine>("medicines", medicine.medicineId, { stock: newStock })
        }
      })

      // Update prescription status
      storage.update<Prescription>("prescriptions", prescriptionId, { status: "dispensed" as const })
      loadData()
    }
  }

  const todayDate = new Date().toISOString().split("T")[0]
  const todayPrescriptions = prescriptions.filter((p) => p.date === todayDate)
  const lowStockMedicines = medicines.filter((m) => m.stock <= m.minStock)

  const todayStats = {
    pendingPrescriptions: todayPrescriptions.filter((p) => p.status === "pending").length,
    dispensedToday: todayPrescriptions.filter((p) => p.status === "dispensed").length,
    lowStockItems: lowStockMedicines.length,
    totalSales: todayPrescriptions
      .filter((p) => p.status === "dispensed")
      .reduce((total, p) => {
        return (
          total +
          p.medicines.reduce((sum: number, m: any) => {
            const medicine = medicines.find((med) => med.id === m.medicineId)
            return sum + (medicine ? medicine.price * m.quantity : 0)
          }, 0)
        )
      }, 0),
  }

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.includes(searchTerm),
  )

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              {prescriptions
                .filter((p) => p.status === "pending")
                .slice(0, 5)
                .map((prescription, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{prescription.patientName}</p>
                        <p className="text-sm text-gray-600">
                          {prescription.doctorName} | {prescription.date}
                        </p>
                      </div>
                      <Badge variant="outline">{prescription.medicines.length} obat</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Obat: {prescription.medicines.map((m: any) => m.medicineName).join(", ")}</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => dispensePrescription(prescription.id)}
                    >
                      Proses Resep
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
              {lowStockMedicines.slice(0, 5).map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-600">
                      Min: {medicine.minStock} | Sisa: {medicine.stock}
                    </p>
                  </div>
                  <Badge variant={medicine.stock <= medicine.minStock * 0.5 ? "destructive" : "secondary"}>
                    {medicine.stock <= medicine.minStock * 0.5 ? "Kritis" : "Peringatan"}
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
            {prescriptions
              .filter((p) => p.status === "dispensed" && p.date === todayDate)
              .slice(0, 4)
              .map((prescription, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{prescription.patientName}</p>
                      <p className="text-sm text-gray-600">
                        {prescription.medicines.map((m: any) => m.medicineName).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      Rp{" "}
                      {prescription.medicines
                        .reduce((sum: number, m: any) => {
                          const medicine = medicines.find((med) => med.id === m.medicineId)
                          return sum + (medicine ? medicine.price * m.quantity : 0)
                        }, 0)
                        .toLocaleString()}
                    </p>
                    <Badge variant="default">Selesai</Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Akses cepat ke fitur utama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={() => setActiveView("prescriptions")} className="h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                Resep Masuk
              </Button>
              <Button onClick={() => setActiveView("stock")} className="h-20 flex-col gap-2" variant="outline">
                <Package className="w-6 h-6" />
                Kelola Stok
              </Button>
              <Button onClick={() => setActiveView("alerts")} className="h-20 flex-col gap-2" variant="outline">
                <AlertTriangle className="w-6 h-6" />
                Stok Menipis
              </Button>
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  )

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Resep Masuk</h2>
          <p className="text-gray-600">Daftar resep dari dokter yang perlu dilayani</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari resep..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">{filteredPrescriptions.length} resep</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Resep</TableHead>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah Obat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">{prescription.id}</TableCell>
                  <TableCell>{prescription.patientName}</TableCell>
                  <TableCell>{prescription.doctorName}</TableCell>
                  <TableCell>{prescription.date}</TableCell>
                  <TableCell>{prescription.medicines.length} obat</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        prescription.status === "dispensed"
                          ? "default"
                          : prescription.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {prescription.status === "dispensed"
                        ? "Sudah Diserahkan"
                        : prescription.status === "cancelled"
                          ? "Dibatalkan"
                          : "Menunggu"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {prescription.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => dispensePrescription(prescription.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Serahkan
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderStock = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kelola Stok Obat</h2>
          <p className="text-gray-600">Input, edit, hapus data obat dan stok</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedItem(null)} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Obat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Tambah Obat</DialogTitle>
            <MedicineForm medicine={selectedItem} onSave={handleSave} onCancel={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari obat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">{filteredMedicines.length} obat</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Obat</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Min. Stok</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>
                    {medicine.stock} {medicine.unit}
                  </TableCell>
                  <TableCell>
                    {medicine.minStock} {medicine.unit}
                  </TableCell>
                  <TableCell>Rp {medicine.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        medicine.stock <= medicine.minStock * 0.5
                          ? "destructive"
                          : medicine.stock <= medicine.minStock
                            ? "secondary"
                            : "default"
                      }
                    >
                      {medicine.stock <= medicine.minStock * 0.5
                        ? "Kritis"
                        : medicine.stock <= medicine.minStock
                          ? "Rendah"
                          : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(medicine)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  // Tambahkan implementasi untuk Laporan Obat
  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan Obat</h2>
          <p className="text-gray-600">Laporan pemakaian dan penjualan obat</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Obat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{medicines.length}</div>
            <p className="text-sm text-gray-600">Jenis obat tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Obat Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Paracetamol</div>
            <p className="text-sm text-gray-600">150 unit terjual bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Penjualan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp 2.500.000</div>
            <p className="text-sm text-gray-600">Bulan Januari 2024</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Laporan Pemakaian Obat</CardTitle>
              <CardDescription>Periode: Januari 2024</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Select defaultValue="january">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">Januari 2024</SelectItem>
                  <SelectItem value="february">Februari 2024</SelectItem>
                  <SelectItem value="march">Maret 2024</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="analgesik">Analgesik</SelectItem>
                  <SelectItem value="antibiotik">Antibiotik</SelectItem>
                  <SelectItem value="batuk">Batuk & Flu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Obat</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok Awal</TableHead>
                <TableHead>Masuk</TableHead>
                <TableHead>Keluar</TableHead>
                <TableHead>Sisa Stok</TableHead>
                <TableHead>Nilai (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.slice(0, 5).map((medicine, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>{medicine.stock + 20}</TableCell>
                  <TableCell className="text-green-600">+10</TableCell>
                  <TableCell className="text-red-600">-30</TableCell>
                  <TableCell>{medicine.stock}</TableCell>
                  <TableCell>{(medicine.stock * medicine.price).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  // Tambahkan implementasi untuk Stok Menipis
  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Stok Menipis</h2>
          <p className="text-gray-600">Monitoring obat yang stoknya menipis</p>
        </div>
        <Button className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buat Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Stok Kritis
            </CardTitle>
            <CardDescription>Obat yang perlu segera direstok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {lowStockMedicines.filter((m) => m.stock <= m.minStock * 0.5).length}
            </div>
            <p className="text-sm text-gray-600">Jenis obat</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Stok Menipis
            </CardTitle>
            <CardDescription>Obat yang perlu diperhatikan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {lowStockMedicines.filter((m) => m.stock > m.minStock * 0.5 && m.stock <= m.minStock).length}
            </div>
            <p className="text-sm text-gray-600">Jenis obat</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Obat Stok Menipis</CardTitle>
          <CardDescription>Obat yang perlu segera direstok</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowStockMedicines.map((medicine, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{medicine.name}</p>
                  <p className="text-sm text-gray-600">
                    Stok saat ini: {medicine.stock} | Minimum: {medicine.minStock}
                  </p>
                  <p className="text-sm text-gray-600">Kategori: {medicine.category}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={medicine.stock <= medicine.minStock * 0.5 ? "destructive" : "secondary"}>
                    {medicine.stock <= medicine.minStock * 0.5 ? "Kritis" : "Peringatan"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buat PO
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Update renderContent untuk menampilkan menu yang sudah diimplementasi dan hapus menu dispensing
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "prescriptions":
        return renderPrescriptions()
      case "stock":
        return renderStock()
      case "reports":
        return renderReports()
      case "alerts":
        return renderAlerts()
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profil Saya</CardTitle>
              <CardDescription>Edit data pribadi</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur profil akan dikembangkan lebih lanjut...</p>
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
