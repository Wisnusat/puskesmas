"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, CheckCircle, Users, Heart, Shield, Stethoscope } from "lucide-react"
import LoginModal from "@/components/login-modal"

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    setShowLoginModal(true)
  }

  const services = [
    {
      name: "POLI UMUM",
      schedule: "Sen-Jum",
      time: "08:00-15:00",
      doctor: "dr. Budi Santoso",
    },
    {
      name: "POLI KIA",
      schedule: "Sen-Sab",
      time: "08:00-14:00",
      doctor: "bidan Sari Dewi",
    },
    {
      name: "POLI GIGI",
      schedule: "Sen-Kam",
      time: "08:00-12:00",
      doctor: "drg. Dewi Lestari",
    },
    {
      name: "POLI LANSIA",
      schedule: "Sen-Rab",
      time: "09:00-12:00",
      doctor: "dr. Ahmad Sehat",
    },
  ]

  const facilities = [
    "Unit Gawat Darurat (UGD) 24 Jam",
    "Laboratorium",
    "Apotik",
    "Poli Umum, KIA, Gigi, Lansia",
    "Imunisasi",
    "KB (Keluarga Berencana)",
    "Gizi",
  ]

  const programs = [
    { icon: "🏥", name: "PROLANIS", desc: "Program Pengelolaan Penyakit Kronis" },
    { icon: "👶", name: "POSYANDU", desc: "Pos Pelayanan Terpadu" },
    { icon: "💉", name: "IMUNISASI", desc: "Vaksinasi Lengkap" },
    { icon: "👴", name: "PROGERIATRI", desc: "Program Geriatri" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-[#2E8B57] text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-2 md:mb-0">
              <h1 className="text-2xl font-bold">PUSKESMAS MKP KELOMPOK 6</h1>
              <p className="text-green-100">Melayani dengan Sepenuh Hati</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(021) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@puskesmasmkp6.go.id</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-[#2E8B57] to-[#87CEEB] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1587230307094-7ea936b24278?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Puskesmas MKP"
              className="mx-auto mb-8 rounded-lg shadow-xl"
            />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pelayanan Kesehatan Terpercaya untuk Keluarga Indonesia
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Memberikan pelayanan kesehatan berkualitas dengan teknologi modern dan tenaga medis profesional
            </p>

            {/* Role Selection Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => handleRoleSelect("admin")}
              >
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-white" />
                  <h3 className="font-bold text-white mb-2">ADMIN</h3>
                  <p className="text-sm text-blue-100 mb-4">Kelola sistem</p>
                  <Button variant="secondary" size="sm" className="w-full">
                    LOGIN ADMIN
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => handleRoleSelect("doctor")}
              >
                <CardContent className="p-6 text-center">
                  <Stethoscope className="w-12 h-12 mx-auto mb-3 text-white" />
                  <h3 className="font-bold text-white mb-2">DOKTER</h3>
                  <p className="text-sm text-blue-100 mb-4">Pemeriksaan pasien</p>
                  <Button variant="secondary" size="sm" className="w-full">
                    LOGIN DOKTER
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => handleRoleSelect("nurse")}
              >
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-white" />
                  <h3 className="font-bold text-white mb-2">PERAWAT</h3>
                  <p className="text-sm text-blue-100 mb-4">Registrasi & perawatan</p>
                  <Button variant="secondary" size="sm" className="w-full">
                    LOGIN PERAWAT
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => handleRoleSelect("pharmacist")}
              >
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-white" />
                  <h3 className="font-bold text-white mb-2">APOTEKER</h3>
                  <p className="text-sm text-blue-100 mb-4">Kelola obat & resep</p>
                  <Button variant="secondary" size="sm" className="w-full">
                    LOGIN APOTEKER
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2E8B57]">Layanan Poli Tersedia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-[#2E8B57]">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="font-semibold">{service.schedule}</p>
                  <p className="text-[#87CEEB] font-medium">{service.time}</p>
                  <p className="text-gray-600">{service.doctor}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8 text-[#2E8B57]">Jam Operasional</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">SENIN - JUMAT</span>
                  <span className="text-[#2E8B57] font-bold">08:00 - 15:00 WIB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">SABTU</span>
                  <span className="text-[#2E8B57] font-bold">08:00 - 12:00 WIB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">MINGGU</span>
                  <span className="text-red-500 font-bold">TUTUP</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-red-600">UGD</span>
                    <Badge variant="destructive">24 JAM</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2E8B57]">Fasilitas Tersedia</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-[#87CEEB]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2E8B57]">Program Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{program.icon}</div>
                  <h3 className="font-bold text-[#2E8B57] mb-2">{program.name}</h3>
                  <p className="text-gray-600 text-sm">{program.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#2E8B57]">Tim Pengembang Sistem</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Tim profesional yang mengembangkan sistem manajemen puskesmas untuk meningkatkan pelayanan kesehatan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Project Manager */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[#2E8B57] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                ZA
              </div>
              <h3 className="text-xl font-bold mb-2">Zahira Alisya Kunaifi</h3>
              <p className="text-[#2E8B57] font-semibold mb-3">Project Manager</p>
              <p className="text-gray-600 text-sm mb-4">
                Mengatur jadwal dan memastikan proyek berjalan lancar sesuai timeline
              </p>

              <div className="text-left space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">TANGGUNG JAWAB:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Membuat jadwal kerja tim</li>
                    <li>• Mengecek progress harian</li>
                    <li>• Koordinasi antar divisi</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">WEWENANG:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Menentukan prioritas tugas</li>
                    <li>• Mengatur pembagian kerja</li>
                    <li>• Evaluasi kinerja tim</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* UI/UX Designer */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[#2E8B57] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                TN
              </div>
              <h3 className="text-xl font-bold mb-2">Tiara Nur Fitriansyah</h3>
              <p className="text-[#2E8B57] font-semibold mb-3">UI/UX Designer</p>
              <p className="text-gray-600 text-sm mb-4">Membuat tampilan website yang bagus dan mudah digunakan</p>

              <div className="text-left space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">TANGGUNG JAWAB:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Mendesain tampilan halaman</li>
                    <li>• Memilih warna dan font</li>
                    <li>• Membuat wireframe</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">WEWENANG:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Menentukan desain tampilan</li>
                    <li>• Memilih tema warna</li>
                    <li>• Revisi desain interface</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Backend Developer */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[#2E8B57] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                NA
              </div>
              <h3 className="text-xl font-bold mb-2">Nabil Abiyyu Zhafran</h3>
              <p className="text-[#2E8B57] font-semibold mb-3">Backend Developer</p>
              <p className="text-gray-600 text-sm mb-4">
                Membuat sistem di belakang layar agar website berfungsi dengan baik
              </p>

              <div className="text-left space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">TANGGUNG JAWAB:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Membuat database</li>
                    <li>• Mengatur penyimpanan data</li>
                    <li>• Integrasi sistem</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">WEWENANG:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Menentukan struktur database</li>
                    <li>• Mengatur keamanan data</li>
                    <li>• Optimasi performa sistem</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Frontend Developer */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[#2E8B57] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                RA
              </div>
              <h3 className="text-xl font-bold mb-2">Radhi Aulia Rahman</h3>
              <p className="text-[#2E8B57] font-semibold mb-3">Frontend Developer</p>
              <p className="text-gray-600 text-sm mb-4">
                Membuat tampilan website yang bisa diklik dan digunakan pengguna
              </p>

              <div className="text-left space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">TANGGUNG JAWAB:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Coding tampilan website</li>
                    <li>• Membuat tombol dan form</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">WEWENANG:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Menentukan cara coding</li>
                    <li>• Memilih framework</li>
                    <li>• Optimasi tampilan</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Content Writer */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[#2E8B57] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                AN
              </div>
              <h3 className="text-xl font-bold mb-2">Audrey Ndjukatana Hamaratu Tidah</h3>
              <p className="text-[#2E8B57] font-semibold mb-3">Content Writer & Dokumentasi</p>
              <p className="text-gray-600 text-sm mb-4">Menulis isi website dan membuat panduan penggunaan sistem</p>

              <div className="text-left space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">TANGGUNG JAWAB:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Menulis teks di website</li>
                    <li>• Membuat panduan user</li>
                    <li>• Dokumentasi sistem</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">WEWENANG:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Menentukan isi konten</li>
                    <li>• Menyetujui teks website</li>
                    <li>• Revisi dokumentasi</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Quality Tester */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[#2E8B57] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                MR
              </div>
              <h3 className="text-xl font-bold mb-2">Muhammad Rizky Ikhsan Saputro</h3>
              <p className="text-[#2E8B57] font-semibold mb-3">Quality Tester</p>
              <p className="text-gray-600 text-sm mb-4">
                Mengecek website agar tidak ada error dan berfungsi dengan baik
              </p>

              <div className="text-left space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">TANGGUNG JAWAB:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Testing semua fitur</li>
                    <li>• Mencari bug dan error</li>
                    <li>• Validasi fungsionalitas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">WEWENANG:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Menentukan standar testing</li>
                    <li>• Menyetujui hasil test</li>
                    <li>• Reject fitur bermasalah</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-[#2E8B57] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">Informasi Kontak</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-2">Alamat</h3>
                <p className="text-green-100">Jl. Kesehatan No. 123, Kecamatan Sehat, Kabupaten Sejahtera</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-2">Telepon</h3>
                <p className="text-green-100">(021) 1234-5678</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-green-100">info@puskesmasmkp6.go.id</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-green-400">
              <p className="text-green-100">
                <strong>Kepala Puskesmas:</strong> dr. Ahmad Sehat, M.Kes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} selectedRole={selectedRole} />
    </div>
  )
}
