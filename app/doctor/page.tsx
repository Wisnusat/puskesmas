"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, ClipboardList, Pill, History, FileText, UserCircle, Clock } from "lucide-react"

export default function DoctorDashboard() {
  const [activeView, setActiveView] = useState("dashboard")

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

  const todaySchedule = {
    doctor: "dr. Budi Santoso",
    poli: "Poli Umum",
    schedule: "Senin - Jumat, 08:00 - 15:00",
    totalPatients: 12,
    completed: 8,
    remaining: 4,
  }

  const todayPatients = [
    {
      id: "001234",
      name: "Budi Santoso",
      age: 45,
      time: "08:30",
      complaint: "Demam dan batuk",
      status: "completed",
      queue: 1,
    },
    {
      id: "001235",
      name: "Siti Aminah",
      age: 32,
      time: "09:00",
      complaint: "Sakit kepala",
      status: "completed",
      queue: 2,
    },
    {
      id: "001236",
      name: "Ahmad Fauzi",
      age: 28,
      time: "09:30",
      complaint: "Nyeri perut",
      status: "in-progress",
      queue: 3,
    },
    {
      id: "001237",
      name: "Dewi Sari",
      age: 35,
      time: "10:00",
      complaint: "Kontrol diabetes",
      status: "waiting",
      queue: 4,
    },
    {
      id: "001238",
      name: "Rudi Hartono",
      age: 50,
      time: "10:30",
      complaint: "Hipertensi",
      status: "waiting",
      queue: 5,
    },
  ]

  const recentPrescriptions = [
    {
      patientName: "Budi Santoso",
      medicines: ["Paracetamol 500mg", "OBH Combi"],
      date: "2024-01-15",
      status: "dispensed",
    },
    {
      patientName: "Siti Aminah",
      medicines: ["Ibuprofen 400mg", "Vitamin B Complex"],
      date: "2024-01-15",
      status: "pending",
    },
    {
      patientName: "Ahmad Fauzi",
      medicines: ["Antasida", "Domperidone"],
      date: "2024-01-15",
      status: "pending",
    },
  ]

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
              {todayPatients.slice(0, 5).map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{patient.queue}</Badge>
                      <div>
                        <p className="font-medium">{patient.name}</p>
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
            <CardDescription>Resep yang baru dibuat hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPrescriptions.map((prescription, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{prescription.patientName}</p>
                    <Badge variant={prescription.status === "dispensed" ? "default" : "secondary"}>
                      {prescription.status === "dispensed" ? "Sudah Diambil" : "Menunggu"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Obat: {prescription.medicines.join(", ")}</p>
                    <p>Tanggal: {prescription.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPatients = () => (
    <Card>
      <CardHeader>
        <CardTitle>Pasien Hari Ini</CardTitle>
        <CardDescription>Kelola pemeriksaan pasien</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todayPatients.map((patient, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  #{patient.queue}
                </Badge>
                <div>
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-sm text-gray-600">
                    RM: {patient.id} | Umur: {patient.age} tahun
                  </p>
                  <p className="text-sm text-gray-600">Keluhan: {patient.complaint}</p>
                  <p className="text-sm text-gray-600">Jadwal: {patient.time}</p>
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
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    {patient.status === "in-progress" ? "Lanjut Periksa" : "Mulai Periksa"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "patients":
        return renderPatients()
      case "history":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pemeriksaan</CardTitle>
              <CardDescription>Riwayat pemeriksaan pasien sebelumnya</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur riwayat pemeriksaan akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "prescriptions":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Resep Obat</CardTitle>
              <CardDescription>Kelola resep obat untuk pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur resep obat akan dikembangkan di sini...</p>
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
              <p className="text-gray-600">Fitur catatan medis akan dikembangkan di sini...</p>
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
              <p className="text-gray-600">Fitur profil akan dikembangkan di sini...</p>
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
