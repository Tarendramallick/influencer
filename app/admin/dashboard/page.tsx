"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      router.push("/auth/login")
      return
    }
    setIsAdmin(true)
    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications")
      if (res.ok) {
        const data = await res.json()
        setApplications(data.applications)
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (applicationId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      })

      if (res.ok) {
        setApplications((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status: "Approved" } : app)))
      }
    } catch (error) {
      console.error("Failed to approve application:", error)
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      })

      if (res.ok) {
        setApplications((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status: "Rejected" } : app)))
      }
    } catch (error) {
      console.error("Failed to reject application:", error)
    }
  }

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              IC
            </div>
            <span className="font-semibold text-foreground">Admin Panel</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-sm font-medium text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/campaigns" className="text-sm text-muted-foreground hover:text-foreground">
              Manage Campaigns
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/auth/login")
              }}
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the influencer campaign platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold text-foreground">{applications.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-bold text-foreground">
                    {applications.filter((a) => a.status === "Applied").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold text-foreground">
                    {applications.filter((a) => a.status === "Approved").length}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Link href="/admin/campaigns/create">
                  <Button>Create New Campaign</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              applications.map((app) => (
                <Card key={app._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{app.influencerName}</h3>
                        <p className="text-sm text-muted-foreground">{app.influencerEmail}</p>
                        <p className="text-sm mt-2">
                          Status: <span className="font-semibold">{app.status}</span>
                        </p>
                      </div>
                      {app.status === "Applied" && (
                        <div className="space-x-2">
                          <Button size="sm" onClick={() => handleApprove(app._id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(app._id)}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="influencers">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Influencer verification feature coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Payment tracking coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
