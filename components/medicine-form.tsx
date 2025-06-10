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

interface Medicine {
  id?: string
  name: string
  stock: number
  minStock: number
  price: number
  unit: string
  category: string
  description: string
  expiry: string
}

interface MedicineFormProps {
  medicine?: Medicine
  onSave: (medicine: Medicine) => void
  onCancel: () => void
}

export default function MedicineForm({ medicine, onSave, onCancel }: MedicineFormProps) {
  const [formData, setFormData] = useState<Medicine>({
    name: medicine?.name || "",
    stock: medicine?.stock || 0,
    minStock: medicine?.minStock || 0,
    price: medicine?.price || 0,
    unit: medicine?.unit || "",
    category: medicine?.category || "",
    description: medicine?.description || "",
    expiry: medicine?.expiry || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const storage = HospitalStorage.getInstance()

  const categories = [
    "Analgesik",
    "Antibiotik",
    "Batuk & Flu",
    "Pencernaan",
    "Vitamin",
    "Kardiovaskular",
    "Diabetes",
    "Hipertensi",
    "Lainnya",
  ]

  const units = ["tablet", "kapsul", "strip", "botol", "tube", "ampul", "vial", "sachet"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.name || !formData.unit || !formData.category) {
        throw new Error("Nama obat, satuan, dan kategori wajib diisi")
      }

      if (formData.stock < 0 || formData.minStock < 0 || formData.price < 0) {
        throw new Error("Stok, minimum stok, dan harga tidak boleh negatif")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (medicine?.id) {
        // Update existing medicine
        storage.update("medicines", medicine.id, formData)
      } else {
        // Create new medicine
        const newMedicine = {
          ...formData,
          id: storage.generateId(),
        }
        storage.create("medicines", newMedicine)
      }

      onSave(formData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Medicine, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{medicine ? "Edit Obat" : "Tambah Obat Baru"}</CardTitle>
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
              <Label htmlFor="name">Nama Obat *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nama obat"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stok Saat Ini</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange("stock", Number.parseInt(e.target.value) || 0)}
                placeholder="Jumlah stok"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stok</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleChange("minStock", Number.parseInt(e.target.value) || 0)}
                placeholder="Minimum stok"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseInt(e.target.value) || 0)}
                placeholder="Harga per unit"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Satuan *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange("unit", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Tanggal Kadaluarsa</Label>
              <Input
                id="expiry"
                type="date"
                value={formData.expiry}
                onChange={(e) => handleChange("expiry", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Deskripsi obat"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              {loading ? "Menyimpan..." : medicine ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
