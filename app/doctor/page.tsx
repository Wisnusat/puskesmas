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
import PrescriptionForm from "@/components/prescription-form"
import { HospitalStorage } from "@/lib/storage"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Pill,
  History,
  FileText,
  UserCircle,
  Clock,
  Plus,
  Search,
  Edit,
  Eye,
} from "lucide-react"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  poli: string
  date: string
  time: string
  complaint: string
  status: string
  queueNumber: number
}

export default function DoctorDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [appointments, setAppointments] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])
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
    {
      icon: Users,
      label: "Pasien Hari Ini",
      active: activeView === "patients",
      onClick: () => setActiveView("patients"),
    },
    {
      icon: History,
      label: "Riwayat Pemeriksaan",
      active: activeView === "history",
      onClick: () => setActiveView("history"),
    },
    {
      icon: Pill,
      label: "Resep Obat",
      active: activeView === "prescriptions",
      onClick: () => setActiveView("prescriptions"),
    },
    { icon: FileText, label: "Catatan Medis", active: activeView === "notes", onClick: () => setActiveView("notes") },
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
    const userSession = localStorage.getItem("userSession")
    if (userSession) {
      const session = JSON.parse(userSession)
      const users = storage.getAll("users")
      const currentDoctor: any = users.find((u: any) => u.username === session.username)

      if (currentDoctor) {
        // Filter appointments for current doctor
        const allAppointments = storage.getAll("appointments")
        const doctorAppointments = allAppointments.filter((apt: any) => apt.doctorName === currentDoctor.name)
        setAppointments(doctorAppointments)

        // Filter prescriptions for current doctor
        const allPrescriptions = storage.getAll("prescriptions")
        const doctorPrescriptions = allPrescriptions.filter((presc: any) => presc.doctorId === currentDoctor.id)
        setPrescriptions(doctorPrescriptions)

        // Filter medical records for current doctor
        const allRecords = storage.getAll("medicalRecords")
        const doctorRecords = allRecords.filter((record: any) => record.doctorId === currentDoctor.id)
        setMedicalRecords(doctorRecords)
      }
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setSelectedItem(null)
    loadData()
  }

  const updateAppointmentStatus = (id: string, status: string) => {
    storage.update<Appointment>("appointments", id, { status })
    loadData()
  }

  const todayDate = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((apt) => apt.date === todayDate)

  const todaySchedule = {
    doctor: "dr. Budi Santoso",
    poli: "Poli Umum",
    schedule: "Senin - Jumat, 08:00 - 15:00",
    totalPatients: todayAppointments.length,
    completed: todayAppointments.filter((apt) => apt.status === "completed").length,
    remaining: todayAppointments.filter((apt) => apt.status !== "completed" && apt.status !== "cancelled").length,
  }

  const filteredAppointments = todayAppointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.complaint.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || prescription.id.includes(searchTerm),
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Doctor Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-green-600" />
            Informasi Dokter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Nama Dokter</p>
              <p className="font-semibold">{todaySchedule.doctor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Poli</p>
              <p className="font-semibold">{todaySchedule.poli}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jadwal Praktek</p>
              <p className="font-semibold">{todaySchedule.schedule}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pasien</p>
                <p className="text-2xl font-bold">{todaySchedule.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai Diperiksa</p>
                <p className="text-2xl font-bold text-green-600">{todaySchedule.completed}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-orange-600">{todaySchedule.remaining}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Pasien Hari Ini</CardTitle>
            <CardDescription>Daftar pasien yang akan diperiksa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{patient.queueNumber}</Badge>
                      <div>
                        <p className="font-medium">{patient.patientName}</p>
                        <p className="text-sm text-gray-600">{patient.complaint}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{patient.time}</p>
                    <Badge
                      variant={
                        patient.status === "completed"
                          ? "default"
                          : patient.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {patient.status === "completed"
                        ? "Selesai"
                        : patient.status === "in-progress"
                          ? "Sedang Diperiksa"
                          : "Menunggu"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Resep Terbaru</CardTitle>
            <CardDescription>Resep yang baru dibuat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prescriptions.slice(0, 5).map((prescription, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{prescription.patientName}</p>
                    <Badge variant={prescription.status === "dispensed" ? "default" : "secondary"}>
                      {prescription.status === "dispensed" ? "Sudah Diambil" : "Menunggu"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Obat: {prescription.medicines.map((m: any) => m.medicineName).join(", ")}</p>
                    <p>Tanggal: {prescription.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
              <Users className="w-6 h-6" />
              Pasien Hari Ini
            </Button>
            <Button onClick={() => setActiveView("prescriptions")} className="h-20 flex-col gap-2" variant="outline">
              <Pill className="w-6 h-6" />
              Buat Resep
            </Button>
            <Button onClick={() => setActiveView("history")} className="h-20 flex-col gap-2" variant="outline">
              <History className="w-6 h-6" />
              Riwayat Pasien
            </Button>
            <Button onClick={() => setActiveView("notes")} className="h-20 flex-col gap-2" variant="outline">
              <FileText className="w-6 h-6" />
              Catatan Medis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pasien Hari Ini</h2>
          <p className="text-gray-600">Kelola pemeriksaan pasien</p>
        </div>
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
            <Badge variant="outline">{filteredAppointments.length} pasien</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    #{patient.queueNumber}
                  </Badge>
                  <div>
                    <p className="font-semibold">{patient.patientName}</p>
                    <p className="text-sm text-gray-600">
                      ID: {patient.patientId} | Jadwal: {patient.time}
                    </p>
                    <p className="text-sm text-gray-600">Keluhan: {patient.complaint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      patient.status === "completed"
                        ? "default"
                        : patient.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {patient.status === "completed"
                      ? "Selesai"
                      : patient.status === "in-progress"
                        ? "Sedang Diperiksa"
                        : "Menunggu"}
                  </Badge>
                  {patient.status !== "completed" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(patient.id, "in-progress")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {patient.status === "in-progress" ? "Lanjut Periksa" : "Mulai Periksa"}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Pill className="w-4 h-4 mr-2" />
                            Resep
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogTitle>Buat Resep Obat</DialogTitle>
                          <PrescriptionForm
                            appointmentId={patient.id}
                            patientId={patient.patientId}
                            onSave={() => {
                              updateAppointmentStatus(patient.id, "completed")
                              loadData()
                            }}
                            onCancel={() => {}}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Resep Obat</h2>
          <p className="text-gray-600">Kelola resep obat untuk pasien</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedItem(null)} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              <Plus className="w-4 h-4 mr-2" />
              Buat Resep Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Buat Resep Baru</DialogTitle>
            <PrescriptionForm prescription={selectedItem} onSave={handleSave} onCancel={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(prescription)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "patients":
        return renderPatients()
      case "prescriptions":
        return renderPrescriptions()
      case "history":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pemeriksaan</CardTitle>
              <CardDescription>Riwayat pemeriksaan pasien sebelumnya</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur riwayat pemeriksaan akan dikembangkan lebih lanjut...</p>
            </CardContent>
          </Card>
        )
      case "notes":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Catatan Medis</CardTitle>
              <CardDescription>Catatan khusus untuk pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur catatan medis akan dikembangkan lebih lanjut...</p>
            </CardContent>
          </Card>
        )
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profil Saya</CardTitle>
              <CardDescription>Edit data pribadi dan jadwal praktek</CardDescription>
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
    <DashboardLayout title="Dashboard Dokter" role="doctor" sidebarItems={sidebarItems}>
      {renderContent()}
    </DashboardLayout>
  )
}
