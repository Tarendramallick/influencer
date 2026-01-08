"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface InfluencerLayoutProps {
  children: React.ReactNode
}

export default function InfluencerLayout({ children }: InfluencerLayoutProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    router.push("/auth/login")
  }

  const navItems = [
    { href: "/influencer/dashboard", label: "Campaigns", icon: "📢" },
    { href: "/influencer/applications", label: "Applications", icon: "📋" },
    { href: "/influencer/payments", label: "Earnings", icon: "💰" },
    { href: "/profile/setup", label: "Profile", icon: "👤" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 border-b border-border bg-card z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/influencer/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              IC
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">InfluencerHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 InfluencerHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
