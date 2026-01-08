"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchApplications()
  }, [])

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the influencer campaign platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

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
      </div>
    </div>
  )
}
