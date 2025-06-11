/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HospitalStorage } from "@/lib/storage"
import type { User } from "@/lib/types"

interface UserFormProps {
  user?: User
  onSave: (user: User) => void
  onCancel: () => void
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<Omit<User, "id">>({
    username: user?.username || "",
    password: user?.password || "",
    name: user?.name || "",
    role: user?.role || "nurse",
    email: user?.email || "",
    phone: user?.phone || "",
    poli: user?.poli || "",
    schedule: user?.schedule || "",
    license: user?.license || "",
    shift: user?.shift || "",
    status: user?.status || "active",
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
      if (!formData.username || !formData.password || !formData.name || !formData.role) {
        throw new Error("Username, password, nama, dan role wajib diisi")
      }

      // Check if username already exists (for new users)
      if (!user) {
        const existingUsers = storage.getAll<User>("users")
        const usernameExists = existingUsers.some((u) => u.username === formData.username)
        if (usernameExists) {
          throw new Error("Username sudah digunakan, silakan pilih username lain")
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (user?.id) {
        // Update existing user
        storage.update<User>("users", user.id, formData)
      } else {
        // Create new user
        const newUser = {
          ...formData,
          id: storage.generateId(),
        }
        storage.create("users", newUser)
      }

      onSave(formData as User)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{user ? "Edit User" : "Tambah User Baru"}</CardTitle>
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
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Username"
                required
                disabled={!!user} // Disable username editing for existing users
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "doctor" | "nurse" | "pharmacist") => handleChange("role", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Dokter</SelectItem>
                  <SelectItem value="nurse">Perawat</SelectItem>
                  <SelectItem value="pharmacist">Apoteker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Nomor telepon"
              />
            </div>

            {formData.role === "doctor" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="poli">Poli</Label>
                  <Input
                    id="poli"
                    value={formData.poli}
                    onChange={(e) => handleChange("poli", e.target.value)}
                    placeholder="Poli"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Jadwal</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => handleChange("schedule", e.target.value)}
                    placeholder="Jadwal praktek"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">No. STR</Label>
                  <Input
                    id="license"
                    value={formData.license}
                    onChange={(e) => handleChange("license", e.target.value)}
                    placeholder="Nomor STR"
                  />
                </div>
              </>
            )}

            {formData.role === "nurse" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift</Label>
                  <Select value={formData.shift || ""} onValueChange={(value) => handleChange("shift", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pagi">Pagi</SelectItem>
                      <SelectItem value="Siang">Siang</SelectItem>
                      <SelectItem value="Malam">Malam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">No. SIKP</Label>
                  <Input
                    id="license"
                    value={formData.license}
                    onChange={(e) => handleChange("license", e.target.value)}
                    placeholder="Nomor SIKP"
                  />
                </div>
              </>
            )}

            {formData.role === "pharmacist" && (
              <div className="space-y-2">
                <Label htmlFor="license">No. SIPA</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => handleChange("license", e.target.value)}
                  placeholder="Nomor SIPA"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") => handleChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              {loading ? "Menyimpan..." : user ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
