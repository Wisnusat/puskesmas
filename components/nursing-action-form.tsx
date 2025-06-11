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
import type { NursingAction } from "@/lib/types"

interface NursingActionFormProps {
  nursingAction?: NursingAction
  onSave: (nursingAction: NursingAction) => void
  onCancel: () => void
}

export default function NursingActionForm({ nursingAction, onSave, onCancel }: NursingActionFormProps) {
  const [formData, setFormData] = useState<Omit<NursingAction, "id" | "nurseId" | "nurseName">>({
    patientId: nursingAction?.patientId || "",
    patientName: nursingAction?.patientName || "",
    date: nursingAction?.date || new Date().toISOString().split("T")[0],
    actionType: nursingAction?.actionType || "",
    description: nursingAction?.description || "",
    status: nursingAction?.status || "pending",
  })
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const storage = HospitalStorage.getInstance()

  const actionTypes = [
    "Pemeriksaan Vital Sign",
    "Perawatan Luka",
    "Injeksi Obat",
    "Pemasangan Infus",
    "Pemberian Obat Oral",
    "Edukasi Pasien",
    "Lainnya",
  ]

  useEffect(() => {
    // Load patients
    const allPatients = storage.getAll("patients")
    setPatients(allPatients)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.patientId || !formData.actionType || !formData.description) {
        throw new Error("Pasien, jenis tindakan, dan deskripsi wajib diisi")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get current nurse info
      const userSession = localStorage.getItem("userSession")
      if (!userSession) {
        throw new Error("Sesi pengguna tidak ditemukan")
      }
      const currentUser = JSON.parse(userSession)
      if (currentUser.role !== "nurse") {
        throw new Error("Anda tidak memiliki akses untuk melakukan tindakan ini")
      }

      const nursingActionData = {
        ...formData,
        nurseId: currentUser.id,
        nurseName: currentUser.name,
      }

      if (nursingAction?.id) {
        // Update existing nursing action
        storage.update<NursingAction>("nursingActions", nursingAction.id, nursingActionData)
      } else {
        // Create new nursing action
        const newNursingAction = {
          ...nursingActionData,
          id: storage.generateId(),
        }
        storage.create("nursingActions", newNursingAction)
      }

      onSave(nursingActionData as NursingAction)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{nursingAction ? "Edit Tindakan" : "Tindakan Keperawatan Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
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
              <Label htmlFor="date">Tanggal Tindakan *</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionType">Jenis Tindakan *</Label>
              <Select value={formData.actionType} onValueChange={(value) => handleChange("actionType", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis tindakan" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "completed" | "cancelled") => handleChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Tindakan *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Deskripsi tindakan keperawatan"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              {loading ? "Menyimpan..." : nursingAction ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
