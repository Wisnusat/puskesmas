/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

// Local Storage Management for Hospital System
export class HospitalStorage {
  private static instance: HospitalStorage

  static getInstance(): HospitalStorage {
    if (!HospitalStorage.instance) {
      HospitalStorage.instance = new HospitalStorage()
    }
    return HospitalStorage.instance
  }

  // Initialize default data
  initializeData() {
    if (typeof window === "undefined") return

    // Initialize patients if not exists
    if (!localStorage.getItem("patients")) {
      localStorage.setItem("patients", JSON.stringify(this.getDefaultPatients()))
    }

    // Initialize medicines if not exists
    if (!localStorage.getItem("medicines")) {
      localStorage.setItem("medicines", JSON.stringify(this.getDefaultMedicines()))
    }

    // Initialize users if not exists
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(this.getDefaultUsers()))
    }

    // Initialize appointments if not exists
    if (!localStorage.getItem("appointments")) {
      localStorage.setItem("appointments", JSON.stringify(this.getDefaultAppointments()))
    }

    // Initialize prescriptions if not exists
    if (!localStorage.getItem("prescriptions")) {
      localStorage.setItem("prescriptions", JSON.stringify(this.getDefaultPrescriptions()))
    }

    // Initialize medical records if not exists
    if (!localStorage.getItem("medicalRecords")) {
      localStorage.setItem("medicalRecords", JSON.stringify(this.getDefaultMedicalRecords()))
    }
  }

  // Generic CRUD operations
  create<T extends { id: string }>(key: string, item: T): T {
    const items = this.getAll<T>(key)
    items.push(item)
    localStorage.setItem(key, JSON.stringify(items))
    return item
  }

  getAll<T>(key: string): T[] {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  getById<T extends { id: string }>(key: string, id: string): T | null {
    const items = this.getAll<T>(key)
    return items.find((item) => item.id === id) || null
  }

  update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
    const items = this.getAll<T>(key)
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...updates }
      localStorage.setItem(key, JSON.stringify(items))
      return items[index]
    }
    return null
  }

  delete(key: string, id: string): boolean {
    const items = this.getAll(key)
    const filteredItems = items.filter((item: any) => item.id !== id)
    if (filteredItems.length !== items.length) {
      localStorage.setItem(key, JSON.stringify(filteredItems))
      return true
    }
    return false
  }

  // Generate unique ID
  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Default data
  private getDefaultPatients() {
    return [
      {
        id: "001234",
        name: "Budi Santoso",
        age: 45,
        gender: "Laki-laki",
        address: "Jl. Merdeka No. 123",
        phone: "081234567890",
        email: "budi@email.com",
        nik: "3201234567890123",
        registrationDate: "2024-01-15",
        bloodType: "O",
        allergies: "Tidak ada",
        emergencyContact: "Siti Santoso - 081234567891",
      },
      {
        id: "001235",
        name: "Siti Aminah",
        age: 32,
        gender: "Perempuan",
        address: "Jl. Sudirman No. 456",
        phone: "081234567891",
        email: "siti@email.com",
        nik: "3201234567890124",
        registrationDate: "2024-01-15",
        bloodType: "A",
        allergies: "Penisilin",
        emergencyContact: "Ahmad Aminah - 081234567892",
      },
      {
        id: "001236",
        name: "Ahmad Fauzi",
        age: 28,
        gender: "Laki-laki",
        address: "Jl. Thamrin No. 789",
        phone: "081234567892",
        email: "ahmad@email.com",
        nik: "3201234567890125",
        registrationDate: "2024-01-15",
        bloodType: "B",
        allergies: "Tidak ada",
        emergencyContact: "Dewi Fauzi - 081234567893",
      },
    ]
  }

  private getDefaultMedicines() {
    return [
      {
        id: "MED001",
        name: "Paracetamol 500mg",
        stock: 150,
        minStock: 50,
        price: 5000,
        unit: "strip",
        category: "Analgesik",
        description: "Obat pereda nyeri dan penurun demam",
        expiry: "2025-12-31",
      },
      {
        id: "MED002",
        name: "Amoxicillin 500mg",
        stock: 75,
        minStock: 30,
        price: 15000,
        unit: "strip",
        category: "Antibiotik",
        description: "Antibiotik untuk infeksi bakteri",
        expiry: "2025-06-30",
      },
      {
        id: "MED003",
        name: "OBH Combi",
        stock: 25,
        minStock: 20,
        price: 12000,
        unit: "botol",
        category: "Batuk & Flu",
        description: "Obat batuk kombinasi",
        expiry: "2025-03-31",
      },
      {
        id: "MED004",
        name: "Antasida",
        stock: 200,
        minStock: 40,
        price: 8000,
        unit: "tablet",
        category: "Pencernaan",
        description: "Obat maag dan asam lambung",
        expiry: "2025-09-30",
      },
    ]
  }

  private getDefaultUsers() {
    return [
      {
        id: "USR001",
        username: "admin123",
        password: "admin123",
        name: "Administrator",
        role: "admin",
        email: "admin@puskesmas.go.id",
        phone: "081234567890",
      },
      {
        id: "USR002",
        username: "dokter123",
        password: "dokter123",
        name: "dr. Budi Santoso",
        role: "doctor",
        email: "budi@puskesmas.go.id",
        phone: "081234567891",
        poli: "Poli Umum",
        schedule: "Senin - Jumat, 08:00 - 15:00",
        license: "STR123456789",
      },
      {
        id: "USR003",
        username: "perawat123",
        password: "perawat123",
        name: "Sari Perawat",
        role: "nurse",
        email: "sari@puskesmas.go.id",
        phone: "081234567892",
        shift: "Pagi",
        license: "SIKP123456789",
      },
      {
        id: "USR004",
        username: "apoteker123",
        password: "apoteker123",
        name: "Dewi Apoteker",
        role: "pharmacist",
        email: "dewi@puskesmas.go.id",
        phone: "081234567893",
        license: "SIPA123456789",
      },
    ]
  }

  private getDefaultAppointments() {
    return [
      {
        id: "APT001",
        patientId: "001234",
        patientName: "Budi Santoso",
        doctorId: "USR002",
        doctorName: "dr. Budi Santoso",
        poli: "Poli Umum",
        date: "2024-01-15",
        time: "08:30",
        complaint: "Demam dan batuk",
        status: "completed",
        queueNumber: 1,
      },
      {
        id: "APT002",
        patientId: "001235",
        patientName: "Siti Aminah",
        doctorId: "USR002",
        doctorName: "dr. Budi Santoso",
        poli: "Poli Umum",
        date: "2024-01-15",
        time: "09:00",
        complaint: "Sakit kepala",
        status: "in-progress",
        queueNumber: 2,
      },
    ]
  }

  private getDefaultPrescriptions() {
    return [
      {
        id: "RX001",
        appointmentId: "APT001",
        patientId: "001234",
        patientName: "Budi Santoso",
        doctorId: "USR002",
        doctorName: "dr. Budi Santoso",
        date: "2024-01-15",
        medicines: [
          { medicineId: "MED001", medicineName: "Paracetamol 500mg", quantity: 10, dosage: "3x1 setelah makan" },
          { medicineId: "MED003", medicineName: "OBH Combi", quantity: 1, dosage: "3x1 sendok makan" },
        ],
        status: "dispensed",
        notes: "Minum obat sesuai dosis",
      },
    ]
  }

  private getDefaultMedicalRecords() {
    return [
      {
        id: "MR001",
        patientId: "001234",
        appointmentId: "APT001",
        date: "2024-01-15",
        complaint: "Demam dan batuk",
        examination: "TD: 120/80, Suhu: 38.5°C, Nadi: 88x/menit",
        diagnosis: "ISPA (Infeksi Saluran Pernapasan Atas)",
        treatment: "Istirahat, minum obat teratur",
        doctorId: "USR002",
        doctorName: "dr. Budi Santoso",
      },
    ]
  }
}

// Initialize storage when module loads
if (typeof window !== "undefined") {
  HospitalStorage.getInstance().initializeData()
}
