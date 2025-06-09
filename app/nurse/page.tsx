"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Activity,
  Heart,
  FileText,
  UserCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

export default function NurseDashboard() {
  const [activeView, setActiveView] = useState("dashboard")

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

  const todayStats = {
    newRegistrations: 15,
    totalQueue: 23,
    completed: 18,
    waiting: 5,
  }

  const queueData = [
    { poli: "Poli Umum", waiting: 8, completed: 12, doctor: "dr. Budi Santoso" },
    { poli: "Poli KIA", waiting: 3, completed: 5, doctor: "bidan Sari Dewi" },
    { poli: "Poli Gigi", waiting: 2, completed: 4, doctor: "drg. Dewi Lestari" },
    { poli: "Poli Lansia", waiting: 1, completed: 3, doctor: "dr. Ahmad Sehat" },
  ]

  const recentRegistrations = [
    {
      name: "Maya Sari",
      age: 28,
      time: "10:45",
      poli: "Poli Umum",
      complaint: "Demam tinggi",
      status: "waiting",
    },
    {
      name: "Andi Wijaya",
      age: 35,
      time: "10:30",
      poli: "Poli Gigi",
      complaint: "Sakit gigi",
      status: "in-examination",
    },
    {
      name: "Sari Indah",
      age: 25,
      time: "10:15",
      poli: "Poli KIA",
      complaint: "Kontrol kehamilan",
      status: "completed",
    },
    {
      name: "Budi Hartono",
      age: 60,
      time: "10:00",
      poli: "Poli Lansia",
      complaint: "Kontrol diabetes",
      status: "completed",
    },
  ]

  const urgentTasks = [
    { task: "Cek vital sign pasien antrian #15", priority: "high", time: "5 menit lalu" },
    { task: "Update rekam medis Siti Aminah", priority: "medium", time: "10 menit lalu" },
    { task: "Siapkan ruang pemeriksaan Poli 2", priority: "low", time: "15 menit lalu" },
  ]

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
            <CardDescription>Monitoring antrian setiap poli</CardDescription>
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

        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Pendaftaran Terbaru</CardTitle>
            <CardDescription>Pasien yang baru mendaftar hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRegistrations.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">
                      {patient.poli} | {patient.complaint}
                    </p>
                    <p className="text-sm text-gray-500">
                      Umur: {patient.age} tahun | {patient.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      patient.status === "completed"
                        ? "default"
                        : patient.status === "in-examination"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {patient.status === "completed"
                      ? "Selesai"
                      : patient.status === "in-examination"
                        ? "Diperiksa"
                        : "Menunggu"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Tugas Mendesak
          </CardTitle>
          <CardDescription>Tugas yang perlu segera diselesaikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {urgentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "secondary" : "outline"
                    }
                  >
                    {task.priority === "high" ? "Tinggi" : task.priority === "medium" ? "Sedang" : "Rendah"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Selesai
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRegistration = () => (
    <Card>
      <CardHeader>
        <CardTitle>Pendaftaran Pasien</CardTitle>
        <CardDescription>Registrasi pasien baru dan lama</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Fitur pendaftaran pasien akan dikembangkan di sini...</p>
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "registration":
        return renderRegistration()
      case "queue":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Antrian</CardTitle>
              <CardDescription>Kelola nomor antrian per poli</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur daftar antrian akan dikembangkan di sini...</p>
            </CardContent>
          </Card>
        )
      case "examination":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pemeriksaan Awal</CardTitle>
              <CardDescription>Input vital sign dan pemeriksaan awal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fitur pemeriksaan awal akan dikembangkan di sini...</p>
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
              <p className="text-gray-600">Fitur tindakan keperawatan akan dikembangkan di sini...</p>
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
              <p className="text-gray-600">Fitur rekam medis akan dikembangkan di sini...</p>
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
              <p className="text-gray-600">Fitur profil akan dikembangkan di sini...</p>
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
