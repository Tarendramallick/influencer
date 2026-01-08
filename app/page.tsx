"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">Influencer Campaign Platform</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect influencers with brands. Manage campaigns seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>For Influencers</CardTitle>
              <CardDescription>Build your profile and apply to campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a complete profile, discover brand campaigns, and earn money by collaborating.
              </p>
              <div className="space-y-2">
                <Link href="/auth/register?role=influencer">
                  <Button className="w-full">Get Started as Influencer</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Brands</CardTitle>
              <CardDescription>Post campaigns and find perfect influencers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create campaigns, review applications, and manage collaborations with top creators.
              </p>
              <div className="space-y-2">
                <Link href="/auth/register?role=brand">
                  <Button className="w-full">List Your Campaign</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage the entire platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Verify profiles, manage campaigns, review applications, and track payments.
              </p>
              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button className="w-full">Admin Login</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
