"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  const [formData, setFormData] = useState({
    brandName: "",
    brandLogo: "",
    collaborationType: "Sponsored Post",
    description: "",
    requirements: "",
    deadline: "",
    paymentAmount: "",
    referenceVideoUrl: "",
  })

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      router.push("/auth/login")
      return
    }
    setIsAdmin(true)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create campaign")
        return
      }

      router.push("/admin/campaigns")
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
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
            <Link href="/admin/campaigns" className="text-sm text-muted-foreground hover:text-foreground">
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
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>Add a new influencer campaign to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Brand Name</label>
                    <Input
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Brand Logo URL</label>
                    <Input
                      name="brandLogo"
                      value={formData.brandLogo}
                      onChange={handleChange}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Campaign Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the campaign..."
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Campaign Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="What are the requirements for influencers..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Collaboration Type</label>
                    <select
                      name="collaborationType"
                      value={formData.collaborationType}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Sponsored Post</option>
                      <option>Product Review</option>
                      <option>Brand Ambassador</option>
                      <option>Content Creation</option>
                      <option>Influencer Marketing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Payment Amount ($)</label>
                    <Input
                      name="paymentAmount"
                      type="number"
                      value={formData.paymentAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Deadline</label>
                    <Input name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Reference Video URL</label>
                    <Input
                      name="referenceVideoUrl"
                      value={formData.referenceVideoUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </div>

                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Campaign"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
