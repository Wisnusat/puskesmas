"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Stethoscope, Heart, Shield } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRole: string | null
}

const roleConfig = {
  admin: {
    title: "Login Admin",
    icon: Users,
    color: "text-blue-600",
    credentials: { username: "admin123", password: "admin123" },
    route: "/admin",
  },
  doctor: {
    title: "Login Dokter",
    icon: Stethoscope,
    color: "text-green-600",
    credentials: { username: "dokter123", password: "dokter123" },
    route: "/doctor",
  },
  nurse: {
    title: "Login Perawat",
    icon: Heart,
    color: "text-pink-600",
    credentials: { username: "perawat123", password: "perawat123" },
    route: "/nurse",
  },
  pharmacist: {
    title: "Login Apoteker",
    icon: Shield,
    color: "text-purple-600",
    credentials: { username: "apoteker123", password: "apoteker123" },
    route: "/pharmacist",
  },
}

export default function LoginModal({ isOpen, onClose, selectedRole }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const config = selectedRole ? roleConfig[selectedRole as keyof typeof roleConfig] : null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!config) return

    setLoading(true)
    setError("")

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === config.credentials.username && password === config.credentials.password) {
      // Store user session
      localStorage.setItem(
        "userSession",
        JSON.stringify({
          role: selectedRole,
          username: username,
          loginTime: new Date().toISOString(),
        }),
      )

      router.push(config.route)
      onClose()
    } else {
      setError("Username atau password salah!")
    }

    setLoading(false)
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setError("")
    onClose()
  }

  if (!config) return null

  const IconComponent = config.icon

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <IconComponent className={`w-6 h-6 ${config.color}`} />
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Kredensial Demo:</p>
            <p>Username: {config.credentials.username}</p>
            <p>Password: {config.credentials.password}</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
              {loading ? "Memproses..." : "Login"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
