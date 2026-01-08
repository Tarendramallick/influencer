"use client"

import { useState, useEffect } from "react"
import BrandLayout from "@/components/brand-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Campaign {
  _id: string
  collaborationType: string
  paymentAmount: number
  deadline: string
  status: string
}

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/brand/campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data)
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  if (loading)
    return (
      <BrandLayout>
        <div>Loading...</div>
      </BrandLayout>
    )

  return (
    <BrandLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Campaigns</h1>
          <Link href="/brand/campaigns/create">
            <Button>Create New Campaign</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No campaigns yet</p>
                <Link href="/brand/campaigns/create">
                  <Button>Create Your First Campaign</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            campaigns.map((campaign) => (
              <Card key={campaign._id}>
                <CardHeader>
                  <CardTitle>{campaign.collaborationType}</CardTitle>
                  <CardDescription>
                    ₹{campaign.paymentAmount.toLocaleString()} • {campaign.status}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </BrandLayout>
  )
}
