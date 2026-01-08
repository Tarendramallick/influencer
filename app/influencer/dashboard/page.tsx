"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InfluencerLayout from "@/components/influencer-layout"

interface Campaign {
  _id: string
  brandName: string
  brandLogo: string
  collaborationType: string
  deadline: string
  paymentAmount: number
  description: string
}

interface Stats {
  totalApplications: number
  activeApplications: number
  approvedCount: number
}

export default function InfluencerDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<Stats>({ totalApplications: 0, activeApplications: 0, approvedCount: 0 })
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("userId")
        if (!storedUserId) {
          console.error("User ID not found")
          return
        }
        setUserId(storedUserId)

        const [campaignsRes, statsRes] = await Promise.all([
          fetch("/api/campaigns"),
          fetch(`/api/applications?influencerId=${storedUserId}`),
        ])

        if (campaignsRes.ok) {
          const data = await campaignsRes.json()
          setCampaigns(data.campaigns || [])
        }

        if (statsRes.ok) {
          const data = await statsRes.json()
          const apps = data.applications || []
          setStats({
            totalApplications: apps.length,
            activeApplications: apps.filter((a: any) => a.status !== "Rejected").length,
            approvedCount: apps.filter((a: any) => a.status === "Approved").length,
          })
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const daysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  return (
    <InfluencerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Campaign Opportunities</h1>
          <p className="text-muted-foreground">Discover and apply to campaigns that match your content style</p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats.totalApplications}</p>
              <p className="text-xs text-muted-foreground mt-1">campaigns you applied to</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{stats.activeApplications}</p>
              <p className="text-xs text-muted-foreground mt-1">pending review or approved</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ready to Submit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats.approvedCount}</p>
              <p className="text-xs text-muted-foreground mt-1">approved campaigns awaiting content</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Available Campaigns</h2>
            <p className="text-sm text-muted-foreground">{campaigns.length} campaigns available</p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground animate-pulse">Loading campaigns...</p>
              </CardContent>
            </Card>
          ) : campaigns.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No campaigns available right now</p>
                <p className="text-sm text-muted-foreground mb-4">Check back later for new opportunities</p>
                <Link href="/influencer/applications">
                  <Button variant="outline" className="bg-transparent">
                    View Your Applications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign._id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          {campaign.brandLogo && (
                            <img
                              src={campaign.brandLogo || "/placeholder.svg?height=48&width=48&query=brand-logo"}
                              alt={campaign.brandName}
                              className="w-12 h-12 rounded-lg object-cover bg-muted"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{campaign.brandName}</h3>
                            <p className="text-sm text-muted-foreground">{campaign.collaborationType}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground mb-4 line-clamp-2">{campaign.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Deadline</p>
                            <p className="font-semibold text-foreground">
                              {new Date(campaign.deadline).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {daysUntilDeadline(campaign.deadline)} days left
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Payment</p>
                            <p className="font-semibold text-foreground">₹{campaign.paymentAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <Link href={`/campaigns/${campaign._id}/apply`}>
                        <Button className="w-full md:w-auto">Apply Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </InfluencerLayout>
  )
}
