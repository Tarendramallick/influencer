"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import InfluencerLayout from "@/components/influencer-layout"

interface PaymentRecord {
  _id: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-50" },
  Completed: { color: "text-green-700", bg: "bg-green-50" },
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [pendingAmount, setPendingAmount] = useState(0)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const influencerId = localStorage.getItem("userId")
        const res = await fetch(`/api/payments?influencerId=${influencerId}`)
        if (res.ok) {
          const data = await res.json()
          setPayments(data.payments || [])

          const total = (data.payments || []).reduce((sum: number, p: PaymentRecord) => sum + p.amount, 0)
          const pending = (data.payments || [])
            .filter((p: PaymentRecord) => p.status === "Pending")
            .reduce((sum: number, p: PaymentRecord) => sum + p.amount, 0)

          setTotalEarnings(total)
          setPendingAmount(pending)
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  return (
    <InfluencerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Earnings & Payments</h1>
          <p className="text-muted-foreground">Track your campaign earnings and payment status</p>
        </div>

        {/* Earnings Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">₹{totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">from all completed campaigns</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">₹{pendingAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">awaiting admin approval</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">₹{(totalEarnings - pendingAmount).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">successfully received</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View all your payments and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground animate-pulse">Loading payments...</p>
            ) : payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No payments yet. Complete campaigns to earn money.
              </p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => {
                  const config = statusConfig[payment.status] || statusConfig.Pending
                  return (
                    <div
                      key={payment._id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-border pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-foreground">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${config.bg} ${config.color} border-0 w-fit`}>{payment.status}</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InfluencerLayout>
  )
}
