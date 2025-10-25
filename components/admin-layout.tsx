"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LayoutDashboard,
  Users,
  Wallet,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  FileText,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface AdminLayoutProps {
  children: React.ReactNode
  user: {
    full_name: string
    email: string
    role: string
  }
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isAdmin = user.role === "admin"

  const navigation = [
    { name: "Dashboard", href: isAdmin ? "/admin" : "/subadmin", icon: LayoutDashboard, roles: ["admin", "subadmin"] },
    {
      name: "Deposits",
      href: isAdmin ? "/admin/deposits" : "/subadmin/deposits",
      icon: Wallet,
      roles: ["admin", "subadmin"],
    },
    { name: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart, roles: ["admin"] },
    { name: "Transfers", href: "/admin/transfers", icon: FileText, roles: ["admin"] },
    { name: "Sub Admins", href: "/admin/subadmins", icon: UserCog, roles: ["admin"] },
    { name: "Logs", href: "/admin/logs", icon: FileText, roles: ["admin"] },
    { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin"] },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user.role))

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href={isAdmin ? "/admin" : "/subadmin"} className="flex items-center gap-2 font-bold">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">{isAdmin ? "Super Admin" : "Sub Admin"}</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="border-b border-border p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {isAdmin ? "Super Admin" : "Sub Admin"}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <ThemeToggle />
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
