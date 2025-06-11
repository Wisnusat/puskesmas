/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PatientForm from "@/components/patient-form";
import MedicineForm from "@/components/medicine-form";
import { HospitalStorage } from "@/lib/storage";
import {
  LayoutDashboard,
  Users,
  Building2,
  Database,
  FileText,
  Settings,
  UserCheck,
  Package,
  AlertTriangle,
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [patients, setPatients] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);

  const storage = HospitalStorage.getInstance();

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: activeView === "dashboard",
      onClick: () => setActiveView("dashboard"),
    },
    {
      icon: Users,
      label: "Manajemen User",
      active: activeView === "users",
      onClick: () => setActiveView("users"),
    },
    {
      icon: UserCheck,
      label: "Data Pasien",
      active: activeView === "patients",
      onClick: () => setActiveView("patients"),
    },
    {
      icon: Package,
      label: "Data Obat",
      active: activeView === "medicines",
      onClick: () => setActiveView("medicines"),
    },
    {
      icon: Building2,
      label: "Manajemen Puskesmas",
      active: activeView === "hospital",
      onClick: () => setActiveView("hospital"),
    },
    {
      icon: Database,
      label: "Data Master",
      active: activeView === "master",
      onClick: () => setActiveView("master"),
    },
    {
      icon: FileText,
      label: "Laporan",
      active: activeView === "reports",
      onClick: () => setActiveView("reports"),
    },
    {
      icon: Settings,
      label: "Pengaturan Sistem",
      active: activeView === "settings",
      onClick: () => setActiveView("settings"),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPatients(storage.getAll("patients"));
    setMedicines(storage.getAll("medicines"));
    setUsers(storage.getAll("users"));
    setAppointments(storage.getAll("appointments"));
  };

  const handleDelete = (type: string, id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      storage.delete(type, id);
      loadData();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = () => {
    loadData();
  };

  const stats = [
    {
      title: "Total Pasien Hari Ini",
      value: appointments
        .filter((apt) => apt.date === new Date().toISOString().split("T")[0])
        .length.toString(),
      change: "+12%",
      trend: "up",
      icon: UserCheck,
      color: "text-blue-600",
    },
    {
      title: "Total Pasien Terdaftar",
      value: patients.length.toString(),
      change: `+${
        patients.filter(
          (p) => p.registrationDate === new Date().toISOString().split("T")[0]
        ).length
      } hari ini`,
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Stok Obat Kritis",
      value: medicines.filter((m) => m.stock <= m.minStock).length.toString(),
      change: "Perlu Perhatian",
      trend: "warning",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "User Aktif",
      value: users.length.toString(),
      change: "Total User",
      trend: "stable",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.id.includes(searchTerm)
  );

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p
                      className={`text-sm ${
                        stat.trend === "up"
                          ? "text-green-600"
                          : stat.trend === "warning"
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses cepat ke fitur utama</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setActiveView("patients")}
              className="h-20 flex-col gap-2"
            >
              <UserCheck className="w-6 h-6" />
              Data Pasien
            </Button>
            <Button
              onClick={() => setActiveView("medicines")}
              className="h-20 flex-col gap-2"
              variant="outline"
            >
              <Package className="w-6 h-6" />
              Data Obat
            </Button>
            <Button
              onClick={() => setActiveView("users")}
              className="h-20 flex-col gap-2"
              variant="outline"
            >
              <Users className="w-6 h-6" />
              Manajemen User
            </Button>
            <Button
              onClick={() => setActiveView("reports")}
              className="h-20 flex-col gap-2"
              variant="outline"
            >
              <FileText className="w-6 h-6" />
              Laporan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Stok Obat Menipis
          </CardTitle>
          <CardDescription>Obat yang perlu segera direstok</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medicines
              .filter((m) => m.stock <= m.minStock)
              .slice(0, 5)
              .map((medicine, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-600">
                      Minimum: {medicine.minStock}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        medicine.stock <= medicine.minStock * 0.5
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {medicine.stock}
                    </p>
                    <Badge
                      variant={
                        medicine.stock <= medicine.minStock * 0.5
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {medicine.stock <= medicine.minStock * 0.5
                        ? "Kritis"
                        : "Peringatan"}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPatients = () => {
    if (showPatientForm) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowPatientForm(false);
                setSelectedItem(null);
              }}
            >
              ← Kembali ke Daftar Pasien
            </Button>
            <div>
              <h2 className="text-2xl font-bold">
                {selectedItem ? "Edit Pasien" : "Tambah Pasien Baru"}
              </h2>
              <p className="text-gray-600">
                Lengkapi form untuk {selectedItem ? "mengubah" : "mendaftarkan"}{" "}
                data pasien
              </p>
            </div>
          </div>

          <PatientForm
            patient={selectedItem}
            onSave={() => {
              setShowPatientForm(false);
              setSelectedItem(null);
              loadData();
            }}
            onCancel={() => {
              setShowPatientForm(false);
              setSelectedItem(null);
            }}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Data Pasien</h2>
            <p className="text-gray-600">Kelola data pasien puskesmas</p>
          </div>
          <Button
            onClick={() => {
              setSelectedItem(null);
              setShowPatientForm(true);
            }}
            className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pasien
          </Button>
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
              <Badge variant="outline">{filteredPatients.length} pasien</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Umur</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.registrationDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(patient);
                            setShowPatientForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("patients", patient.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMedicines = () => {
    if (showMedicineForm) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowMedicineForm(false);
                setSelectedItem(null);
              }}
            >
              ← Kembali ke Daftar Obat
            </Button>
            <div>
              <h2 className="text-2xl font-bold">
                {selectedItem ? "Edit Obat" : "Tambah Obat Baru"}
              </h2>
              <p className="text-gray-600">
                Lengkapi form untuk {selectedItem ? "mengubah" : "menambahkan"}{" "}
                data obat
              </p>
            </div>
          </div>

          <MedicineForm
            medicine={selectedItem}
            onSave={() => {
              setShowMedicineForm(false);
              setSelectedItem(null);
              loadData();
            }}
            onCancel={() => {
              setShowMedicineForm(false);
              setSelectedItem(null);
            }}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Data Obat</h2>
            <p className="text-gray-600">Kelola inventori obat puskesmas</p>
          </div>
          <Button
            onClick={() => {
              setSelectedItem(null);
              setShowMedicineForm(true);
            }}
            className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Obat
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari obat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="outline">{filteredMedicines.length} obat</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Obat</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Min. Stok</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">
                      {medicine.name}
                    </TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>
                      {medicine.stock} {medicine.unit}
                    </TableCell>
                    <TableCell>
                      {medicine.minStock} {medicine.unit}
                    </TableCell>
                    <TableCell>Rp {medicine.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          medicine.stock <= medicine.minStock * 0.5
                            ? "destructive"
                            : medicine.stock <= medicine.minStock
                            ? "secondary"
                            : "default"
                        }
                      >
                        {medicine.stock <= medicine.minStock * 0.5
                          ? "Kritis"
                          : medicine.stock <= medicine.minStock
                          ? "Rendah"
                          : "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(medicine);
                            setShowMedicineForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("medicines", medicine.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Tambahkan implementasi untuk Manajemen User
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen User</h2>
          <p className="text-gray-600">
            Kelola data dokter, perawat, dan apoteker
          </p>
        </div>
        <Button className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="doctor">Dokter</SelectItem>
                <SelectItem value="nurse">Perawat</SelectItem>
                <SelectItem value="pharmacist">Apoteker</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "default"
                          : user.role === "doctor"
                          ? "secondary"
                          : user.role === "nurse"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "doctor"
                        ? "Dokter"
                        : user.role === "nurse"
                        ? "Perawat"
                        : "Apoteker"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Aktif</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // Tambahkan implementasi untuk Manajemen Puskesmas
  const renderHospital = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Puskesmas</h2>
          <p className="text-gray-600">
            Kelola profil, jadwal, dan fasilitas puskesmas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Puskesmas</CardTitle>
            <CardDescription>Informasi dasar puskesmas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Puskesmas</Label>
                <Input id="name" defaultValue="PUSKESMAS MKP KELOMPOK 6" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  defaultValue="Jl. Kesehatan No. 123, Kecamatan Sehat, Kabupaten Sejahtera"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input id="phone" defaultValue="(021) 1234-5678" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="info@puskesmasmkp6.go.id" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="head">Kepala Puskesmas</Label>
                <Input id="head" defaultValue="dr. Ahmad Sehat, M.Kes" />
              </div>

              <Button className="w-full bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jam Operasional</CardTitle>
            <CardDescription>Atur jam buka puskesmas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="monday-friday">Senin - Jumat</Label>
                <div className="flex gap-2">
                  <Input
                    id="monday-friday-start"
                    className="w-24"
                    defaultValue="08:00"
                  />
                  <span className="self-center">-</span>
                  <Input
                    id="monday-friday-end"
                    className="w-24"
                    defaultValue="15:00"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="saturday">Sabtu</Label>
                <div className="flex gap-2">
                  <Input
                    id="saturday-start"
                    className="w-24"
                    defaultValue="08:00"
                  />
                  <span className="self-center">-</span>
                  <Input
                    id="saturday-end"
                    className="w-24"
                    defaultValue="12:00"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="sunday">Minggu</Label>
                <Badge variant="destructive">TUTUP</Badge>
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="emergency" className="text-red-600 font-medium">
                  UGD
                </Label>
                <Badge variant="destructive">24 JAM</Badge>
              </div>

              <Button className="w-full bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manajemen Poli</CardTitle>
          <CardDescription>
            Kelola poli yang tersedia di puskesmas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Poli
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Poli</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>{service.doctor}</TableCell>
                    <TableCell>
                      {service.schedule}, {service.time}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Aktif</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Tambahkan implementasi untuk Data Master
  const renderMaster = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Master</h2>
          <p className="text-gray-600">Kelola data poli, obat, dan penyakit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Data Poli
            </CardTitle>
            <CardDescription>Kelola data poli</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Total: {services.length} poli
            </p>
            <Button className="w-full">Kelola Data Poli</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Data Obat
            </CardTitle>
            <CardDescription>Kelola data obat</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Total: {medicines.length} obat
            </p>
            <Button className="w-full">Kelola Data Obat</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Data Penyakit
            </CardTitle>
            <CardDescription>Kelola data penyakit</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Total: 150 penyakit</p>
            <Button className="w-full">Kelola Data Penyakit</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategori Obat</CardTitle>
          <CardDescription>Kelola kategori obat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kategori
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Analgesik",
                "Antibiotik",
                "Batuk & Flu",
                "Pencernaan",
                "Vitamin",
                "Kardiovaskular",
                "Diabetes",
                "Hipertensi",
              ].map((category, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <span>{category}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jenis Tindakan</CardTitle>
          <CardDescription>Kelola jenis tindakan medis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Tindakan
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Tindakan</TableHead>
                  <TableHead>Tarif (Rp)</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { code: "T001", name: "Pemeriksaan Umum", fee: 50000 },
                  { code: "T002", name: "Perawatan Luka", fee: 75000 },
                  { code: "T003", name: "Injeksi", fee: 25000 },
                  { code: "T004", name: "Cabut Gigi", fee: 100000 },
                  { code: "T005", name: "Imunisasi", fee: 0 },
                ].map((action, index) => (
                  <TableRow key={index}>
                    <TableCell>{action.code}</TableCell>
                    <TableCell className="font-medium">{action.name}</TableCell>
                    <TableCell>{action.fee.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Tambahkan implementasi untuk Laporan
  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan</h2>
          <p className="text-gray-600">
            Generate laporan kunjungan, keuangan, dan persediaan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Laporan Kunjungan
            </CardTitle>
            <CardDescription>Laporan kunjungan pasien</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Periode:</span>
                <Select defaultValue="january">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">Januari 2024</SelectItem>
                    <SelectItem value="february">Februari 2024</SelectItem>
                    <SelectItem value="march">Maret 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Generate Laporan</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Laporan Keuangan
            </CardTitle>
            <CardDescription>
              Laporan pendapatan dan pengeluaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Periode:</span>
                <Select defaultValue="january">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">Januari 2024</SelectItem>
                    <SelectItem value="february">Februari 2024</SelectItem>
                    <SelectItem value="march">Maret 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Generate Laporan</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Laporan Persediaan
            </CardTitle>
            <CardDescription>Laporan stok obat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status:</span>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="low">Stok Menipis</SelectItem>
                    <SelectItem value="critical">Stok Kritis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Generate Laporan</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laporan Kunjungan Pasien</CardTitle>
          <CardDescription>Periode: Januari 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold">120</div>
                  <p className="text-sm text-gray-600">Total Kunjungan</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold">85</div>
                  <p className="text-sm text-gray-600">Pasien Umum</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold">35</div>
                  <p className="text-sm text-gray-600">Pasien BPJS</p>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4">Grafik Kunjungan Harian</h3>
              <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">
                  Grafik kunjungan akan ditampilkan di sini
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Update renderContent untuk menampilkan menu yang sudah diimplementasi
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard();
      case "patients":
        return renderPatients();
      case "medicines":
        return renderMedicines();
      case "users":
        return renderUsers();
      case "hospital":
        return renderHospital();
      case "master":
        return renderMaster();
      case "reports":
        return renderReports();
      case "settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Sistem</CardTitle>
              <CardDescription>Konfigurasi sistem umum</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Fitur pengaturan akan dikembangkan lebih lanjut...
              </p>
            </CardContent>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  const services = [
    {
      name: "Poli Umum",
      doctor: "dr. Ahmad Sehat",
      schedule: "Senin-Jumat",
      time: "08:00-12:00",
    },
    {
      name: "Poli Gigi",
      doctor: "drg. Siti Senyum",
      schedule: "Selasa & Kamis",
      time: "13:00-16:00",
    },
    {
      name: "Poli Anak",
      doctor: "dr. Budi Ceria",
      schedule: "Senin, Rabu, Jumat",
      time: "09:00-11:00",
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard Admin"
      role="admin"
      sidebarItems={sidebarItems}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
