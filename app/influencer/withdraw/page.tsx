"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WithdrawalData {
  availableBalance: number
  pendingWithdrawals: number
  completedWithdrawals: number
}

interface WithdrawalRequest {
  _id: string
  amount: number
  status: string
  requestedAt: string
  processedAt?: string
}

export default function InfluencerWithdraw() {
  const [data, setData] = useState<WithdrawalData | null>(null)
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([])
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/auth/login")
          return
        }

        const response = await fetch("/api/influencer/withdrawals", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const result = await response.json()
          setData(result.summary)
          setWithdrawalHistory(result.history)
        }
      } catch (error) {
        console.error("Failed to fetch withdrawal data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleWithdraw = async () => {
    if (!amount || !upiId) {
      alert("Please fill all fields")
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/influencer/withdrawals/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          method,
          upiId,
        }),
      })

      if (response.ok) {
        alert("Withdrawal request submitted successfully!")
        setAmount("")
        setUpiId("")
        // Refresh data
      }
    } catch (error) {
      console.error("Failed to submit withdrawal:", error)
      alert("Failed to submit withdrawal request")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (!data) return <div className="text-center py-8">No data available</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Withdrawal & Payments</h1>
        <p className="text-muted-foreground">Manage your earnings and withdrawal requests</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{data.availableBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{data.pendingWithdrawals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{data.completedWithdrawals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully transferred</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
          <CardDescription>Withdraw your earnings to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">UPI ID / Bank Details</label>
            <Input
              placeholder={method === "upi" ? "yourname@upi" : "Bank account details"}
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>

          <Button onClick={handleWithdraw} disabled={submitting || !amount || !upiId} className="w-full">
            {submitting ? "Processing..." : "Request Withdrawal"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Your recent withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawalHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No withdrawal requests yet</p>
            ) : (
              withdrawalHistory.map((request) => (
                <div key={request._id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">₹{request.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : request.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
