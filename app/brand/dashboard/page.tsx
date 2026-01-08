"use client"

import { useEffect, useState } from "react"
import BrandLayout from "@/components/brand-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import Link from "next/link"

interface CampaignStats {
  totalCampaigns: number
  activeCampaigns: number
  totalApplications: number
  approvedApplications: number
  totalSpent: number
  walletBalance: number
}

export default function BrandDashboard() {
  const [stats, setStats] = useState<CampaignStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplications: 0,
    approvedApplications: 0,
    totalSpent: 0,
    walletBalance: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/brand/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const chartData = [
    { month: "Jan", campaigns: 2, applications: 15 },
    { month: "Feb", campaigns: 3, applications: 25 },
    { month: "Mar", campaigns: 4, applications: 35 },
    { month: "Apr", campaigns: 3, applications: 28 },
  ]

  if (loading)
    return (
      <BrandLayout>
        <div className="text-center py-8">Loading...</div>
      </BrandLayout>
    )

  return (
    <BrandLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Brand Dashboard</h1>
            <p className="text-muted-foreground">Manage your campaigns and influencer partnerships</p>
          </div>
          <Link href="/brand/campaigns/create">
            <Button>Create Campaign</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">Total: {stats.totalCampaigns}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.approvedApplications} approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{stats.walletBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Available funds</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Growth</CardTitle>
              <CardDescription>Campaigns and applications over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="campaigns" fill="hsl(var(--primary))" />
                  <Bar dataKey="applications" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
              <CardDescription>Monthly budget utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="campaigns" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">New application received</p>
                  <p className="text-sm text-muted-foreground">Product Launch Campaign - 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">Content submission approved</p>
                  <p className="text-sm text-muted-foreground">Summer Collection - 5 hours ago</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  )
}
