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
import type { VitalSign } from "@/lib/types"

interface VitalSignFormProps {
  vitalSign?: VitalSign
  onSave: (vitalSign: VitalSign) => void
  onCancel: () => void
}

export default function VitalSignForm({ vitalSign, onSave, onCancel }: VitalSignFormProps) {
  const [formData, setFormData] = useState<Omit<VitalSign, "id" | "nurseId" | "nurseName">>({
    patientId: vitalSign?.patientId || "",
    patientName: vitalSign?.patientName || "",
    date: vitalSign?.date || new Date().toISOString().split("T")[0],
    bloodPressure: vitalSign?.bloodPressure || "",
    heartRate: vitalSign?.heartRate || 0,
    temperature: vitalSign?.temperature || 0,
    respiration: vitalSign?.respiration || 0,
    weight: vitalSign?.weight || 0,
    height: vitalSign?.height || 0,
    complaint: vitalSign?.complaint || "",
    notes: vitalSign?.notes || "",
  })
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const storage = HospitalStorage.getInstance()

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
      if (!formData.patientId || !formData.bloodPressure || !formData.temperature) {
        throw new Error("Pasien, tekanan darah, dan suhu tubuh wajib diisi")
      }

      // Get current nurse info
      const userSession = localStorage.getItem("userSession")
      if (!userSession) {
        throw new Error("Sesi pengguna tidak ditemukan")
      }
      const currentUser = JSON.parse(userSession)
      if (currentUser.role !== "nurse") {
        throw new Error("Anda tidak memiliki akses untuk melakukan tindakan ini")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const vitalSignData = {
        ...formData,
        nurseId: currentUser.id,
        nurseName: currentUser.name,
      }

      if (vitalSign?.id) {
        // Update existing vital sign
        storage.update<VitalSign>("vitalSigns", vitalSign.id, vitalSignData)
      } else {
        // Create new vital sign
        const newVitalSign = {
          ...vitalSignData,
          id: storage.generateId(),
        }
        storage.create("vitalSigns", newVitalSign)
      }

      onSave(vitalSignData as VitalSign)
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
        <CardTitle>{vitalSign ? "Edit Pemeriksaan" : "Pemeriksaan Awal Baru"}</CardTitle>
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
              <Label htmlFor="date">Tanggal Pemeriksaan *</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Tekanan Darah (mmHg) *</Label>
              <Input
                type="text"
                id="bloodPressure"
                value={formData.bloodPressure}
                onChange={(e) => handleChange("bloodPressure", e.target.value)}
                placeholder="120/80"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartRate">Detak Jantung (bpm) *</Label>
              <Input
                type="number"
                id="heartRate"
                value={formData.heartRate}
                onChange={(e) => handleChange("heartRate", Number(e.target.value))}
                placeholder="80"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Suhu Tubuh (°C) *</Label>
              <Input
                type="number"
                id="temperature"
                value={formData.temperature}
                onChange={(e) => handleChange("temperature", Number(e.target.value))}
                placeholder="36.5"
                step="0.1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="respiration">Respirasi (x/menit)</Label>
              <Input
                type="number"
                id="respiration"
                value={formData.respiration}
                onChange={(e) => handleChange("respiration", Number(e.target.value))}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Berat Badan (kg)</Label>
              <Input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => handleChange("weight", Number(e.target.value))}
                placeholder="65"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Tinggi Badan (cm)</Label>
              <Input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => handleChange("height", Number(e.target.value))}
                placeholder="170"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complaint">Keluhan Utama</Label>
            <Textarea
              id="complaint"
              value={formData.complaint}
              onChange={(e) => handleChange("complaint", e.target.value)}
              placeholder="Keluhan pasien"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Pemeriksaan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Catatan tambahan"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              {loading ? "Menyimpan..." : vitalSign ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
