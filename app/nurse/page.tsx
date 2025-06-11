/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import AppointmentForm from "@/components/appointment-form";
import VitalSignForm from "@/components/vital-sign-form";
import NursingActionForm from "@/components/nursing-action-form";
import { HospitalStorage } from "@/lib/storage";
import type { VitalSign, NursingAction } from "@/lib/types";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Activity,
  Heart,
  FileText,
  UserCircle,
  Clock,
  Plus,
  Search,
  Edit,
  CheckCircle,
  Eye,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { User } from "lucide-react";

export default function NurseDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [nursingActions, setNursingActions] = useState<NursingAction[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedVitalSign, setSelectedVitalSign] = useState<VitalSign | null>(
    null
  );
  const [selectedNursingAction, setSelectedNursingAction] =
    useState<NursingAction | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showVitalSignForm, setShowVitalSignForm] = useState(false);
  const [showNursingActionForm, setShowNursingActionForm] = useState(false);

  const storage = HospitalStorage.getInstance();

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
      onClick: () => {
        setActiveView("registration");
        setShowAppointmentForm(false);
      },
    },
    {
      icon: Users,
      label: "Daftar Antrian",
      active: activeView === "queue",
      onClick: () => setActiveView("queue"),
    },
    {
      icon: Activity,
      label: "Pemeriksaan Awal",
      active: activeView === "examination",
      onClick: () => {
        setActiveView("examination");
        setShowVitalSignForm(false);
      },
    },
    {
      icon: Heart,
      label: "Tindakan Keperawatan",
      active: activeView === "nursing",
      onClick: () => {
        setActiveView("nursing");
        setShowNursingActionForm(false);
      },
    },
    {
      icon: FileText,
      label: "Rekam Medis",
      active: activeView === "records",
      onClick: () => setActiveView("records"),
    },
    {
      icon: User,
      label: "Profil",
      active: activeView === "profile",
      onClick: () => setActiveView("profile"),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAppointments(storage.getAll("appointments"));
    setPatients(storage.getAll("patients"));
    setVitalSigns(storage.getAll("vitalSigns"));
    setNursingActions(storage.getAll("nursingActions"));
    setMedicalRecords(storage.getAll("medicalRecords"));
  };

  const handleSaveAppointment = (appointment: any) => {
    loadData();
    setShowAppointmentForm(false);
    setSelectedAppointment(null);
  };

  const handleSaveVitalSign = (vitalSign: VitalSign) => {
    loadData();
    setShowVitalSignForm(false);
    setSelectedVitalSign(null);
  };

  const handleSaveNursingAction = (nursingAction: NursingAction) => {
    loadData();
    setShowNursingActionForm(false);
    setSelectedNursingAction(null);
  };

  const handleDeleteVitalSign = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pemeriksaan ini?")) {
      storage.delete("vitalSigns", id);
      loadData();
    }
  };

  const handleDeleteNursingAction = (id: string) => {
    if (
      confirm("Apakah Anda yakin ingin menghapus tindakan keperawatan ini?")
    ) {
      storage.delete("nursingActions", id);
      loadData();
    }
  };

  const handleCompleteNursingAction = (id: string) => {
    storage.update<NursingAction>("nursingActions", id, { status: "completed" as const });
    loadData();
  };

  const filteredVitalSigns = vitalSigns.filter(
    (vs) =>
      vs.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vs.complaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNursingActions = nursingActions.filter(
    (na) =>
      na.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      na.actionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedicalRecords = medicalRecords.filter(
    (record) =>
      record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pasien Hari Ini
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter(
                  (a) => a.date === new Date().toISOString().split("T")[0]
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Pasien terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pemeriksaan Selesai
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                vitalSigns.filter(
                  (vs) => vs.date === new Date().toISOString().split("T")[0]
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Pemeriksaan hari ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tindakan Selesai
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nursingActions.filter((na) => na.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tindakan keperawatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Antrian Menunggu
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((a) => a.status === "waiting").length}
            </div>
            <p className="text-xs text-muted-foreground">Pasien menunggu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Antrian Hari Ini</CardTitle>
            <CardDescription>Daftar pasien yang akan diperiksa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .filter(
                  (appointment) =>
                    appointment.date === new Date().toISOString().split("T")[0]
                )
                .slice(0, 5)
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time} - {appointment.complaint}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "completed"
                          ? "default"
                          : appointment.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {appointment.status === "completed"
                        ? "Selesai"
                        : appointment.status === "in-progress"
                        ? "Berlangsung"
                        : "Menunggu"}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tindakan Keperawatan Hari Ini</CardTitle>
            <CardDescription>Tindakan yang perlu dilakukan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nursingActions
                .filter(
                  (action) =>
                    action.date === new Date().toISOString().split("T")[0]
                )
                .slice(0, 5)
                .map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{action.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.actionType}
                      </p>
                    </div>
                    <Badge
                      variant={
                        action.status === "completed"
                          ? "default"
                          : action.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {action.status === "completed"
                        ? "Selesai"
                        : action.status === "pending"
                        ? "Menunggu"
                        : "Dibatalkan"}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderExamination = () => (
    <div className="space-y-6">
      {showVitalSignForm ? (
        <div>
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowVitalSignForm(false);
                setSelectedVitalSign(null);
              }}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h2 className="text-2xl font-bold">
              {selectedVitalSign
                ? "Edit Pemeriksaan"
                : "Tambah Pemeriksaan Baru"}
            </h2>
          </div>
          <VitalSignForm
            vitalSign={selectedVitalSign || undefined}
            onSave={handleSaveVitalSign}
            onCancel={() => {
              setShowVitalSignForm(false);
              setSelectedVitalSign(null);
            }}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Pemeriksaan Awal</h2>
              <p className="text-muted-foreground">
                Kelola data pemeriksaan vital sign pasien
              </p>
            </div>
            <Button
              className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
              onClick={() => {
                setSelectedVitalSign(null);
                setShowVitalSignForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pemeriksaan
            </Button>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Data Pemeriksaan</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari pasien atau keluhan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Vital Sign</TableHead>
                    <TableHead>Keluhan</TableHead>
                    <TableHead>Perawat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVitalSigns.map((vitalSign) => (
                    <TableRow key={vitalSign.id}>
                      <TableCell>
                        {new Date(vitalSign.date).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {vitalSign.patientName}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>TD: {vitalSign.bloodPressure}</div>
                          <div>Suhu: {vitalSign.temperature}°C</div>
                          <div>Nadi: {vitalSign.heartRate} bpm</div>
                        </div>
                      </TableCell>
                      <TableCell>{vitalSign.complaint}</TableCell>
                      <TableCell>{vitalSign.nurseName}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVitalSign(vitalSign);
                              setShowVitalSignForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteVitalSign(vitalSign.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      )}
    </div>
  );

  const renderNursing = () => (
    <div className="space-y-6">
      {showNursingActionForm ? (
        <div>
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowNursingActionForm(false);
                setSelectedNursingAction(null);
              }}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h2 className="text-2xl font-bold">
              {selectedNursingAction
                ? "Edit Tindakan Keperawatan"
                : "Tambah Tindakan Keperawatan"}
            </h2>
          </div>
          <NursingActionForm
            nursingAction={selectedNursingAction || undefined}
            onSave={handleSaveNursingAction}
            onCancel={() => {
              setShowNursingActionForm(false);
              setSelectedNursingAction(null);
            }}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Tindakan Keperawatan</h2>
              <p className="text-muted-foreground">
                Kelola tindakan keperawatan untuk pasien
              </p>
            </div>
            <Button
              className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
              onClick={() => {
                setSelectedNursingAction(null);
                setShowNursingActionForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tindakan
            </Button>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Daftar Tindakan</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari pasien atau tindakan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Jenis Tindakan</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Perawat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNursingActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        {new Date(action.date).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {action.patientName}
                      </TableCell>
                      <TableCell>{action.actionType}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {action.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            action.status === "completed"
                              ? "default"
                              : action.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {action.status === "completed"
                            ? "Selesai"
                            : action.status === "pending"
                            ? "Menunggu"
                            : "Dibatalkan"}
                        </Badge>
                      </TableCell>
                      <TableCell>{action.nurseName}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {action.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleCompleteNursingAction(action.id)
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedNursingAction(action);
                              setShowNursingActionForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNursingAction(action.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      )}
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rekam Medis</h2>
          <p className="text-muted-foreground">
            Lihat riwayat rekam medis pasien
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Rekam Medis</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pasien atau diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {record.patientName || "N/A"}
                  </TableCell>
                  <TableCell>{record.complaint}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>{record.doctorName}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegistration = () => (
    <div className="space-y-6">
      {showAppointmentForm ? (
        <div>
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAppointmentForm(false);
                setSelectedAppointment(null);
              }}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h2 className="text-2xl font-bold">
              {selectedAppointment
                ? "Edit Pendaftaran Pasien"
                : "Pendaftaran Pasien Baru"}
            </h2>
          </div>
          <AppointmentForm
            appointment={selectedAppointment}
            onSave={handleSaveAppointment}
            onCancel={() => {
              setShowAppointmentForm(false);
              setSelectedAppointment(null);
            }}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Pendaftaran Pasien</h2>
              <p className="text-muted-foreground">
                Daftarkan pasien baru untuk pemeriksaan
              </p>
            </div>
            <Button
              className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
              onClick={() => {
                setSelectedAppointment(null);
                setShowAppointmentForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Daftar Pasien Baru
            </Button>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pendaftaran Hari Ini</CardTitle>
              <CardDescription>
                Daftar pasien yang sudah terdaftar hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments
                  .filter(
                    (appointment) =>
                      appointment.date ===
                      new Date().toISOString().split("T")[0]
                  )
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          #{appointment.queueNumber}
                        </Badge>
                        <div>
                          <p className="font-semibold">
                            {appointment.patientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.poli} | {appointment.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Keluhan: {appointment.complaint}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            appointment.status === "completed"
                              ? "default"
                              : appointment.status === "in-progress"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {appointment.status === "completed"
                            ? "Selesai"
                            : appointment.status === "in-progress"
                            ? "Sedang Diperiksa"
                            : "Menunggu"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowAppointmentForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderQueue = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Daftar Antrian</h2>
          <p className="text-gray-600">Monitor dan kelola antrian pasien</p>
        </div>
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
            <Badge variant="outline">
              {
                appointments.filter(
                  (a) => a.date === new Date().toISOString().split("T")[0]
                ).length
              }{" "}
              antrian
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Antrian</TableHead>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Poli</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Keluhan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments
                .filter(
                  (a) => a.date === new Date().toISOString().split("T")[0]
                )
                .map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        #{appointment.queueNumber}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {appointment.patientName}
                    </TableCell>
                    <TableCell>{appointment.poli}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.complaint}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appointment.status === "completed"
                            ? "default"
                            : appointment.status === "in-progress"
                            ? "secondary"
                            : appointment.status === "cancelled"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {appointment.status === "completed"
                          ? "Selesai"
                          : appointment.status === "in-progress"
                          ? "Sedang Diperiksa"
                          : appointment.status === "cancelled"
                          ? "Dibatalkan"
                          : "Menunggu"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {appointment.status === "waiting" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const updated = {
                                ...appointment,
                                status: "in-progress",
                              };
                              storage.update(
                                "appointments",
                                appointment.id,
                                updated
                              );
                              loadData();
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mulai
                          </Button>
                        )}
                        {appointment.status === "in-progress" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const updated = {
                                ...appointment,
                                status: "completed",
                              };
                              storage.update(
                                "appointments",
                                appointment.id,
                                updated
                              );
                              loadData();
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {appointment.status !== "completed" &&
                          appointment.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const updated = {
                                  ...appointment,
                                  status: "cancelled",
                                };
                                storage.update(
                                  "appointments",
                                  appointment.id,
                                  updated
                                );
                                loadData();
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
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

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard();
      case "registration":
        return renderRegistration();
      case "queue":
        return renderQueue();
      case "examination":
        return renderExamination();
      case "nursing":
        return renderNursing();
      case "records":
        return renderRecords();
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profil Perawat</h2>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <UserCircle className="h-16 w-16 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">Sari Perawat</h3>
                      <p className="text-muted-foreground">
                        Perawat - Shift Pagi
                      </p>
                      <p className="text-sm text-muted-foreground">
                        SIKP: SIKP123456789
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>Email</p>
                      <p>sari@puskesmas.go.id</p>
                    </div>
                    <div>
                      <p>Telepon</p>
                      <p>081234567892</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardLayout
      title="Dashboard Perawat"
      sidebarItems={sidebarItems}
      role="nurse"
    >
      {renderContent()}
    </DashboardLayout>
  );
}
