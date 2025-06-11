/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HospitalStorage } from "@/lib/storage"

interface Appointment {
  id?: string
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

interface AppointmentFormProps {
  appointment?: Appointment
  onSave: (appointment: Appointment) => void
  onCancel: () => void
}

export default function AppointmentForm({ appointment, onSave, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState<Appointment>({
    patientId: appointment?.patientId || "",
    patientName: appointment?.patientName || "",
    doctorId: appointment?.doctorId || "",
    doctorName: appointment?.doctorName || "",
    poli: appointment?.poli || "",
    date: appointment?.date || new Date().toISOString().split("T")[0],
    time: appointment?.time || "",
    complaint: appointment?.complaint || "",
    status: appointment?.status || "waiting",
    queueNumber: appointment?.queueNumber || 0,
  })
  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const storage = HospitalStorage.getInstance()

  const polis = [
    { name: "Poli Umum", doctor: "dr. Budi Santoso" },
    { name: "Poli KIA", doctor: "bidan Sari Dewi" },
    { name: "Poli Gigi", doctor: "drg. Dewi Lestari" },
    { name: "Poli Lansia", doctor: "dr. Ahmad Sehat" },
  ]

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
  ]

  useEffect(() => {
    // Load patients and doctors
    const allPatients = storage.getAll("patients")
    const allUsers = storage.getAll("users")
    const allDoctors = allUsers.filter((user: any) => user.role === "doctor")

    setPatients(allPatients)
    setDoctors(allDoctors)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.patientId || !formData.poli || !formData.date || !formData.time) {
        throw new Error("Pasien, poli, tanggal, dan waktu wajib diisi")
      }

      // Generate queue number
      const todayAppointments = storage
        .getAll("appointments")
        .filter((apt: any) => apt.date === formData.date && apt.poli === formData.poli)
      const queueNumber = todayAppointments.length + 1

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const appointmentData = {
        ...formData,
        queueNumber: appointment?.queueNumber || queueNumber,
      }

      if (appointment?.id) {
        // Update existing appointment
        storage.update("appointments", appointment.id, appointmentData)
      } else {
        // Create new appointment
        const newAppointment = {
          ...appointmentData,
          id: storage.generateId(),
        }
        storage.create("appointments", newAppointment)
      }

      onSave(appointmentData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Appointment, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    if (patient) {
      setFormData((prev) => ({
        ...prev,
        patientId,
        patientName: patient.name,
      }))
    }
  }

  const handlePoliChange = (poli: string) => {
    const poliData = polis.find((p) => p.name === poli)
    if (poliData) {
      const doctor = doctors.find((d) => d.name === poliData.doctor)
      setFormData((prev) => ({
        ...prev,
        poli,
        doctorName: poliData.doctor,
        doctorId: doctor?.id || "",
      }))
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{appointment ? "Edit Janji Temu" : "Buat Janji Temu Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="patient">Pasien *</Label>
              <Select value={formData.patientId} onValueChange={handlePatientChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih pasien" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poli">Poli *</Label>
              <Select value={formData.poli} onValueChange={handlePoliChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih poli" />
                </SelectTrigger>
                <SelectContent>
                  {polis.map((poli) => (
                    <SelectItem key={poli.name} value={poli.name}>
                      {poli.name} - {poli.doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Waktu *</Label>
              <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih waktu" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {appointment && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Menunggu</SelectItem>
                    <SelectItem value="in-progress">Sedang Diperiksa</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="complaint">Keluhan</Label>
            <Textarea
              id="complaint"
              value={formData.complaint}
              onChange={(e) => handleChange("complaint", e.target.value)}
              placeholder="Keluhan pasien"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              {loading ? "Menyimpan..." : appointment ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
