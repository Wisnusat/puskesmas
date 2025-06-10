/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HospitalStorage } from "@/lib/storage"

interface Patient {
  id?: string
  name: string
  age: number
  gender: string
  address: string
  phone: string
  email: string
  nik: string
  bloodType: string
  allergies: string
  emergencyContact: string
}

interface PatientFormProps {
  patient?: Patient
  onSave: (patient: Patient) => void
  onCancel: () => void
}

export default function PatientForm({ patient, onSave, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState<Patient>({
    name: patient?.name || "",
    age: patient?.age || 0,
    gender: patient?.gender || "",
    address: patient?.address || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    nik: patient?.nik || "",
    bloodType: patient?.bloodType || "",
    allergies: patient?.allergies || "",
    emergencyContact: patient?.emergencyContact || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const storage = HospitalStorage.getInstance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.nik) {
        throw new Error("Nama, telepon, dan NIK wajib diisi")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (patient?.id) {
        // Update existing patient
        storage.update("patients", patient.id, formData)
      } else {
        // Create new patient
        const newPatient = {
          ...formData,
          id: storage.generateId(),
          registrationDate: new Date().toISOString().split("T")[0],
        }
        storage.create("patients", newPatient)
      }

      onSave(formData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Patient, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{patient ? "Edit Pasien" : "Tambah Pasien Baru"}</CardTitle>
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
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nik">NIK *</Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={(e) => handleChange("nik", e.target.value)}
                placeholder="Nomor Induk Kependudukan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Umur</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", Number.parseInt(e.target.value) || 0)}
                placeholder="Umur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telepon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Nomor telepon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Alamat email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Golongan Darah</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleChange("bloodType", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih golongan darah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                  <SelectItem value="O">O</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Kontak Darurat</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleChange("emergencyContact", e.target.value)}
                placeholder="Nama - Nomor telepon"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Alamat lengkap"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Alergi</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="Riwayat alergi (jika ada)"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              {loading ? "Menyimpan..." : patient ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
