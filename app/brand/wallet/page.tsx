"use client"

import { useState, useEffect } from "react"
import BrandLayout from "@/components/brand-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WalletData {
  balance: number
  totalSpent: number
  totalRecharged: number
}

export default function BrandWallet() {
  const [wallet, setWallet] = useState<WalletData>({
    balance: 0,
    totalSpent: 0,
    totalRecharged: 0,
  })
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/brand/wallet", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setWallet(data)
        }
      } catch (error) {
        console.error("Failed to fetch wallet:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  const handleRecharge = async () => {
    if (!rechargeAmount) return

    try {
      const token = localStorage.getItem("token")
      await fetch("/api/brand/wallet/recharge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number.parseFloat(rechargeAmount) }),
      })
      setRechargeAmount("")
      // Refresh wallet data
    } catch (error) {
      console.error("Failed to recharge:", error)
    }
  }

  if (loading)
    return (
      <BrandLayout>
        <div>Loading...</div>
      </BrandLayout>
    )

  return (
    <BrandLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Brand Wallet</h1>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{wallet.balance.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{wallet.totalSpent.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Recharged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{wallet.totalRecharged.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recharge Wallet</CardTitle>
            <CardDescription>Add funds to your wallet to create campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter amount (₹)"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
              />
              <Button onClick={handleRecharge}>Recharge</Button>
            </div>
            <p className="text-sm text-muted-foreground">Secure payment via Razorpay, Stripe, or UPI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">Campaign Payment</p>
                  <p className="text-sm text-muted-foreground">Summer Campaign - Product Launch</p>
                </div>
                <p className="font-bold">-₹50,000</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">Wallet Recharge</p>
                  <p className="text-sm text-muted-foreground">Added via Credit Card</p>
                </div>
                <p className="font-bold text-green-600">+₹100,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  )
}
