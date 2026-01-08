import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const db = await connectDB()

    const applications = await db.collection("applications").find({ influencerId: decoded.userId }).toArray()

    const payments = await db.collection("payments").find({ influencerId: decoded.userId }).toArray()

    const completedApplications = applications.filter((a: any) => a.status === "Submitted").length
    const approvedApplications = applications.filter((a: any) => a.status === "Approved").length

    const analytics = {
      campaignsParticipated: applications.length,
      totalEarnings: payments
        .filter((p: any) => p.status === "Completed")
        .reduce((sum: number, p: any) => sum + p.amount, 0),
      completedCampaigns: completedApplications,
      pendingEarnings: payments
        .filter((p: any) => p.status === "Pending")
        .reduce((sum: number, p: any) => sum + p.amount, 0),
      applications: applications.length,
      approvalRate: applications.length > 0 ? Math.round((approvedApplications / applications.length) * 100) : 0,
      engagementRate: 65,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
