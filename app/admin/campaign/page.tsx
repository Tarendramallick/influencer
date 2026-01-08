"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminCampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      router.push("/auth/login")
      return
    }
    setIsAdmin(true)
    fetchCampaigns()
  }, [router])

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/admin/campaigns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data.campaigns)
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c._id !== campaignId))
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error)
    }
  }

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              IC
            </div>
            <span className="font-semibold text-foreground">Admin Panel</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/campaigns" className="text-sm font-medium text-foreground">
              Campaigns
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Campaigns</h1>
          <Link href="/admin/campaigns/create">
            <Button>+ Create Campaign</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No campaigns yet. Create one to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign._id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4 items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{campaign.brandName}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.collaborationType}</p>
                      <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="font-semibold text-foreground">${campaign.paymentAmount}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(campaign._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
