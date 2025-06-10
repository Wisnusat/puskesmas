/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import PatientForm from "@/components/patient-form"
import MedicineForm from "@/components/medicine-form"
import { HospitalStorage } from "@/lib/storage"
import {
  LayoutDashboard,
  Users,
  Building2,
  Database,
  FileText,
  Settings,
  UserCheck,
  Package,
  AlertTriangle,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [patients, setPatients] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const storage = HospitalStorage.getInstance()

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: activeView === "dashboard",
      onClick: () => setActiveView("dashboard"),
    },
    { icon: Users, label: "Manajemen User", active: activeView === "users", onClick: () => setActiveView("users") },
    {
      icon: UserCheck,
      label: "Data Pasien",
      active: activeView === "patients",
      onClick: () => setActiveView("patients"),
    },
    {
      icon: Package,
      label: "Data Obat",
      active: activeView === "medicines",
      onClick: () => setActiveView("medicines"),
    },
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

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setPatients(storage.getAll("patients"))
    setMedicines(storage.getAll("medicines"))
    setUsers(storage.getAll("users"))
    setAppointments(storage.getAll("appointments"))
  }

  const handleDelete = (type: string, id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      storage.delete(type, id)
      loadData()
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setSelectedItem(null)
    loadData()
  }

  const stats = [
    {
      title: "Total Pasien Hari Ini",
      value: appointments.filter((apt) => apt.date === new Date().toISOString().split("T")[0]).length.toString(),
      change: "+12%",
      trend: "up",
      icon: UserCheck,
      color: "text-blue-600",
    },
    {
      title: "Total Pasien Terdaftar",
      value: patients.length.toString(),
      change: `+${patients.filter((p) => p.registrationDate === new Date().toISOString().split("T")[0]).length} hari ini`,
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Stok Obat Kritis",
      value: medicines.filter((m) => m.stock <= m.minStock).length.toString(),
      change: "Perlu Perhatian",
      trend: "warning",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "User Aktif",
      value: users.length.toString(),
      change: "Total User",
      trend: "stable",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.id.includes(searchTerm),
  )

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses cepat ke fitur utama</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => setActiveView("patients")} className="h-20 flex-col gap-2">
              <UserCheck className="w-6 h-6" />
              Data Pasien
            </Button>
            <Button onClick={() => setActiveView("medicines")} className="h-20 flex-col gap-2" variant="outline">
              <Package className="w-6 h-6" />
              Data Obat
            </Button>
            <Button onClick={() => setActiveView("users")} className="h-20 flex-col gap-2" variant="outline">
              <Users className="w-6 h-6" />
              Manajemen User
            </Button>
            <Button onClick={() => setActiveView("reports")} className="h-20 flex-col gap-2" variant="outline">
              <FileText className="w-6 h-6" />
              Laporan
            </Button>
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
            {medicines
              .filter((m) => m.stock <= m.minStock)
              .slice(0, 5)
              .map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-600">Minimum: {medicine.minStock}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${medicine.stock <= medicine.minStock * 0.5 ? "text-red-600" : "text-orange-600"}`}
                    >
                      {medicine.stock}
                    </p>
                    <Badge variant={medicine.stock <= medicine.minStock * 0.5 ? "destructive" : "secondary"}>
                      {medicine.stock <= medicine.minStock * 0.5 ? "Kritis" : "Peringatan"}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Pasien</h2>
          <p className="text-gray-600">Kelola data pasien puskesmas</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedItem(null)} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Tambah Pasien Baru</DialogTitle>
            <PatientForm patient={selectedItem} onSave={handleSave} onCancel={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">{filteredPatients.length} pasien</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Umur</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.registrationDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(patient)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete("patients", patient.id)}>
                        <Trash2 className="w-4 h-4" />
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

  const renderMedicines = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Obat</h2>
          <p className="text-gray-600">Kelola inventori obat puskesmas</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedItem(null)} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Obat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Tambah Obat Baru</DialogTitle>
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
                      <Button size="sm" variant="outline" onClick={() => handleDelete("medicines", medicine.id)}>
                        <Trash2 className="w-4 h-4" />
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

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "patients":
        return renderPatients()
      case "medicines":
        return renderMedicines()
      case "users":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Manajemen User</CardTitle>
              <CardDescription>Kelola data dokter, perawat, dan apoteker</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur manajemen user akan dikembangkan lebih lanjut...</p>
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
              <p className="text-gray-600">Fitur manajemen puskesmas akan dikembangkan lebih lanjut...</p>
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
              <p className="text-gray-600">Fitur data master akan dikembangkan lebih lanjut...</p>
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
              <p className="text-gray-600">Fitur laporan akan dikembangkan lebih lanjut...</p>
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
              <p className="text-gray-600">Fitur pengaturan akan dikembangkan lebih lanjut...</p>
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
