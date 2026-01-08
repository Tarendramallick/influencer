"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const contentCategories = ["Fashion", "Tech", "Fitness", "Food", "Travel", "Beauty", "Gaming", "Lifestyle"]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    instagramLink: "",
    location: "",
    gender: "",
    age: "",
    contentCategory: "",
    followersCount: "",
    language: "",
    phone: "",
    bankDetails: "",
    upiId: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userId = localStorage.getItem("userId")
      const res = await fetch("/api/influencer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
          age: Number.parseInt(formData.age),
          followersCount: Number.parseInt(formData.followersCount),
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create profile")
      }

      router.push("/influencer/dashboard")
    } catch (error) {
      console.error("Profile setup error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Influencer Profile</CardTitle>
            <CardDescription>Fill in all details to make your profile attractive to brands</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram Link</label>
                  <Input
                    type="url"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" value={localStorage.getItem("email") || ""} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-input rounded-md px-3 py-2 bg-background"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <Input type="number" name="age" value={formData.age} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content Category</label>
                  <select
                    name="contentCategory"
                    value={formData.contentCategory}
                    onChange={handleInputChange}
                    className="w-full border border-input rounded-md px-3 py-2 bg-background"
                    required
                  >
                    <option value="">Select Category</option>
                    {contentCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Followers Count</label>
                  <Input
                    type="number"
                    name="followersCount"
                    value={formData.followersCount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content Language</label>
                  <Input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    placeholder="e.g., English, Hindi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Details</label>
                  <Input
                    type="text"
                    name="bankDetails"
                    value={formData.bankDetails}
                    onChange={handleInputChange}
                    placeholder="Account number or IFSC code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">UPI ID</label>
                  <Input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="username@upi"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Setting Up Profile..." : "Complete Profile Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
