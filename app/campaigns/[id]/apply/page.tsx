"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApplyCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || "")
  }, [])

  const handleApply = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: params.id,
          influencerId: userId,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => router.push("/influencer/dashboard"), 2000)
      }
    } catch (error) {
      console.error("Application error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Apply to Campaign</CardTitle>
          <CardDescription>Submit your application to this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-5xl">✓</div>
              <p className="font-semibold">Application Submitted!</p>
              <p className="text-sm text-muted-foreground">
                Your application has been sent to the admin for review. You'll be notified of updates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                By applying, you confirm that your profile information is accurate and up-to-date.
              </p>
              <Button onClick={handleApply} className="w-full" disabled={loading || !userId}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
