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
import AppointmentForm from "@/components/appointment-form"
import { HospitalStorage } from "@/lib/storage"
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Activity,
  Heart,
  FileText,
  UserCircle,
  Clock,
  Plus,
  Search,
  Edit,
  CheckCircle,
  XCircle,
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
}

export default function NurseDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [appointments, setAppointments] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [patients, setPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
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
      icon: UserPlus,
      label: "Pendaftaran Pasien",
      active: activeView === "registration",
      onClick: () => setActiveView("registration"),
    },
    { icon: Users, label: "Daftar Antrian", active: activeView === "queue", onClick: () => setActiveView("queue") },
    {
      icon: Activity,
      label: "Pemeriksaan Awal",
      active: activeView === "examination",
      onClick: () => setActiveView("examination"),
    },
    {
      icon: Heart,
      label: "Tindakan Keperawatan",
      active: activeView === "nursing",
      onClick: () => setActiveView("nursing"),
    },
    { icon: FileText, label: "Rekam Medis", active: activeView === "records", onClick: () => setActiveView("records") },
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
    setAppointments(storage.getAll("appointments"))
    setPatients(storage.getAll("patients"))
  }

  const handleSave = () => {
    setShowForm(false)
    setSelectedAppointment(null)
    loadData()
  }

  const updateAppointmentStatus = (id: string, status: string) => {
    storage.update<Appointment>("appointments", id, { status })
    loadData()
  }

  const todayDate = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((apt) => apt.date === todayDate)

  const todayStats = {
    newRegistrations: todayAppointments.length,
    totalQueue: todayAppointments.filter((apt) => apt.status !== "completed" && apt.status !== "cancelled").length,
    completed: todayAppointments.filter((apt) => apt.status === "completed").length,
    waiting: todayAppointments.filter((apt) => apt.status === "waiting").length,
  }

  const queueData = [
    {
      poli: "Poli Umum",
      waiting: todayAppointments.filter((apt) => apt.poli === "Poli Umum" && apt.status === "waiting").length,
      completed: todayAppointments.filter((apt) => apt.poli === "Poli Umum" && apt.status === "completed").length,
      doctor: "dr. Budi Santoso",
    },
    {
      poli: "Poli KIA",
      waiting: todayAppointments.filter((apt) => apt.poli === "Poli KIA" && apt.status === "waiting").length,
      completed: todayAppointments.filter((apt) => apt.poli === "Poli KIA" && apt.status === "completed").length,
      doctor: "bidan Sari Dewi",
    },
    {
      poli: "Poli Gigi",
      waiting: todayAppointments.filter((apt) => apt.poli === "Poli Gigi" && apt.status === "waiting").length,
      completed: todayAppointments.filter((apt) => apt.poli === "Poli Gigi" && apt.status === "completed").length,
      doctor: "drg. Dewi Lestari",
    },
    {
      poli: "Poli Lansia",
      waiting: todayAppointments.filter((apt) => apt.poli === "Poli Lansia" && apt.status === "waiting").length,
      completed: todayAppointments.filter((apt) => apt.poli === "Poli Lansia" && apt.status === "completed").length,
      doctor: "dr. Ahmad Sehat",
    },
  ]

  const filteredAppointments = todayAppointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.poli.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.includes(searchTerm),
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendaftaran Baru</p>
                <p className="text-2xl font-bold">{todayStats.newRegistrations}</p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Antrian</p>
                <p className="text-2xl font-bold">{todayStats.totalQueue}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-orange-600">{todayStats.waiting}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Status by Poli */}
        <Card>
          <CardHeader>
            <CardTitle>Status Antrian per Poli</CardTitle>
            <CardDescription>Monitoring antrian setiap poli hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {queueData.map((poli, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{poli.poli}</h3>
                    <Badge variant="outline">{poli.doctor}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-orange-600">Menunggu: {poli.waiting}</span>
                    <span className="text-green-600">Selesai: {poli.completed}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Antrian Terbaru</CardTitle>
            <CardDescription>Pasien yang baru mendaftar hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">#{appointment.queueNumber}</Badge>
                      <p className="font-medium">{appointment.patientName}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {appointment.poli} | {appointment.time}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.complaint}</p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "default"
                        : appointment.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {appointment.status === "completed"
                      ? "Selesai"
                      : appointment.status === "in-progress"
                        ? "Diperiksa"
                        : "Menunggu"}
                  </Badge>
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
            <Button onClick={() => setActiveView("registration")} className="h-20 flex-col gap-2">
              <UserPlus className="w-6 h-6" />
              Daftar Pasien
            </Button>
            <Button onClick={() => setActiveView("queue")} className="h-20 flex-col gap-2" variant="outline">
              <Users className="w-6 h-6" />
              Kelola Antrian
            </Button>
            <Button onClick={() => setActiveView("examination")} className="h-20 flex-col gap-2" variant="outline">
              <Activity className="w-6 h-6" />
              Pemeriksaan Awal
            </Button>
            <Button onClick={() => setActiveView("nursing")} className="h-20 flex-col gap-2" variant="outline">
              <Heart className="w-6 h-6" />
              Tindakan Perawatan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRegistration = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pendaftaran Pasien</h2>
          <p className="text-gray-600">Daftarkan pasien untuk janji temu</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedAppointment(null)} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              <Plus className="w-4 h-4 mr-2" />
              Daftar Pasien Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Daftar Pasien Baru</DialogTitle>
            <AppointmentForm
              appointment={selectedAppointment}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pendaftaran Hari Ini</CardTitle>
          <CardDescription>Daftar pasien yang sudah terdaftar hari ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    #{appointment.queueNumber}
                  </Badge>
                  <div>
                    <p className="font-semibold">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.poli} | {appointment.time}
                    </p>
                    <p className="text-sm text-gray-600">Keluhan: {appointment.complaint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "default"
                        : appointment.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {appointment.status === "completed"
                      ? "Selesai"
                      : appointment.status === "in-progress"
                        ? "Sedang Diperiksa"
                        : "Menunggu"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setShowForm(true)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderQueue = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kelola Antrian</h2>
          <p className="text-gray-600">Monitor dan kelola antrian pasien</p>
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
            <Badge variant="outline">{filteredAppointments.length} antrian</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Antrian</TableHead>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Poli</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      #{appointment.queueNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{appointment.patientName}</TableCell>
                  <TableCell>{appointment.poli}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.complaint}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "completed"
                          ? "default"
                          : appointment.status === "in-progress"
                            ? "secondary"
                            : appointment.status === "cancelled"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {appointment.status === "completed"
                        ? "Selesai"
                        : appointment.status === "in-progress"
                          ? "Sedang Diperiksa"
                          : appointment.status === "cancelled"
                            ? "Dibatalkan"
                            : "Menunggu"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {appointment.status === "waiting" && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, "in-progress")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mulai
                        </Button>
                      )}
                      {appointment.status === "in-progress" && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
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
      case "registration":
        return renderRegistration()
      case "queue":
        return renderQueue()
      case "examination":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pemeriksaan Awal</CardTitle>
              <CardDescription>Input vital sign dan pemeriksaan awal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur pemeriksaan awal akan dikembangkan lebih lanjut...</p>
            </CardContent>
          </Card>
        )
      case "nursing":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tindakan Keperawatan</CardTitle>
              <CardDescription>Catat tindakan seperti injeksi, wound care</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur tindakan keperawatan akan dikembangkan lebih lanjut...</p>
            </CardContent>
          </Card>
        )
      case "records":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Rekam Medis</CardTitle>
              <CardDescription>Akses dan update rekam medis pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur rekam medis akan dikembangkan lebih lanjut...</p>
            </CardContent>
          </Card>
        )
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profil Saya</CardTitle>
              <CardDescription>Edit data pribadi dan shift kerja</CardDescription>
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
    <DashboardLayout title="Dashboard Perawat" role="nurse" sidebarItems={sidebarItems}>
      {renderContent()}
    </DashboardLayout>
  )
}
