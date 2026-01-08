"use client"

import { useParams, useRouter } from "next/navigation"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SubmitContentPage() {
  const params = useParams()
  const router = useRouter()
  const [contentLinks, setContentLinks] = useState<string[]>([""])
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || "")
  }, [])

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...contentLinks]
    newLinks[index] = value
    setContentLinks(newLinks)
  }

  const addLinkField = () => {
    setContentLinks([...contentLinks, ""])
  }

  const removeLinkField = (index: number) => {
    setContentLinks(contentLinks.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: params.applicationId,
          influencerId: userId,
          contentLinks: contentLinks.filter((link) => link.trim() !== ""),
          videoUrl,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => router.push("/influencer/applications"), 2000)
      }
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-green-600 text-5xl">✓</div>
            <p className="font-semibold">Content Submitted Successfully!</p>
            <p className="text-sm text-muted-foreground">
              Your submission has been sent for review. The admin will evaluate your content and provide feedback.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Content</CardTitle>
            <CardDescription>Upload your content links/videos for the approved campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Content Links</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Add links to your Instagram posts, TikTok videos, or other content
                </p>
                <div className="space-y-2">
                  {contentLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="url"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        placeholder="https://instagram.com/p/..."
                      />
                      {contentLinks.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removeLinkField(index)} className="px-3">
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" className="mt-2 w-full bg-transparent" onClick={addLinkField}>
                  + Add Another Link
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Video URL (Optional)</label>
                <Input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !userId}>
                {loading ? "Submitting..." : "Submit Content"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
