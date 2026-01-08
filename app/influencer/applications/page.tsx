"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import InfluencerLayout from "@/components/influencer-layout"

interface Application {
  _id: string
  campaignId: string
  status: string
  appliedAt: string
  approvedAt?: string
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  Applied: { color: "text-blue-700", bg: "bg-blue-50" },
  "Under Review": { color: "text-amber-700", bg: "bg-amber-50" },
  Approved: { color: "text-green-700", bg: "bg-green-50" },
  Rejected: { color: "text-red-700", bg: "bg-red-50" },
  Submitted: { color: "text-purple-700", bg: "bg-purple-50" },
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const influencerId = localStorage.getItem("userId")
        const res = await fetch(`/api/applications?influencerId=${influencerId}`)
        if (res.ok) {
          const data = await res.json()
          setApplications(data.applications || [])
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredApplications = filter === "all" ? applications : applications.filter((a) => a.status === filter)

  const statusCounts = {
    all: applications.length,
    Applied: applications.filter((a) => a.status === "Applied").length,
    "Under Review": applications.filter((a) => a.status === "Under Review").length,
    Approved: applications.filter((a) => a.status === "Approved").length,
    Submitted: applications.filter((a) => a.status === "Submitted").length,
  }

  return (
    <InfluencerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Applications</h1>
          <p className="text-muted-foreground">Track and manage all your campaign applications</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["all", "Applied", "Under Review", "Approved", "Submitted"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className={filter !== status ? "bg-transparent" : ""}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === "all" && ` (${statusCounts.all})`}
              {status !== "all" && ` (${statusCounts[status as keyof typeof statusCounts]})`}
            </Button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground animate-pulse">Loading applications...</p>
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {filter === "all" ? "You haven't applied to any campaigns yet" : `No ${filter} applications`}
                </p>
                <Link href="/influencer/dashboard">
                  <Button>Browse Campaigns</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => {
              const config = statusConfig[app.status] || statusConfig.Applied
              return (
                <Card key={app._id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">Campaign Application</h3>
                          <Badge className={`${config.bg} ${config.color} border-0`}>{app.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                        {app.approvedAt && (
                          <p className="text-sm text-muted-foreground">
                            Approved: {new Date(app.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {app.status === "Approved" && (
                          <Link href={`/submissions/${app._id}`}>
                            <Button size="sm">Submit Content</Button>
                          </Link>
                        )}
                        <Link href="/influencer/dashboard">
                          <Button size="sm" variant="outline" className="bg-transparent">
                            View Campaign
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </InfluencerLayout>
  )
}
