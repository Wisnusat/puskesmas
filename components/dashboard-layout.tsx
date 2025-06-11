/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, Menu, X, Home } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  role: string
  sidebarItems: Array<{
    icon: React.ComponentType<any>
    label: string
    href?: string
    onClick?: () => void
    active?: boolean
  }>
}

export default function DashboardLayout({ children, title, role, sidebarItems }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userSession, setUserSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      setUserSession(JSON.parse(session))
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    router.push("/")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-600"
      case "doctor":
        return "bg-green-600"
      case "nurse":
        return "bg-pink-600"
      case "pharmacist":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRoleInitials = (role: string) => {
    switch (role) {
      case "admin":
        return "AD"
      case "doctor":
        return "DR"
      case "nurse":
        return "NR"
      case "pharmacist":
        return "AP"
      default:
        return "US"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#2E8B57]">{title}</h1>
              <p className="text-sm text-gray-600">Puskesmas MKP Kelompok 6</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="hidden sm:flex">
              <Home className="w-4 h-4 mr-2" />
              Beranda
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${getRoleColor(role)} text-white`}>
                      {getRoleInitials(role)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userSession?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <div className="flex-1 px-4 py-6 space-y-2">
              {sidebarItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Button
                    key={index}
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start ${item.active ? getRoleColor(role) : ""}`}
                    onClick={item.onClick}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
