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

    const campaigns = await db.collection("campaigns").find({ brandId: decoded.userId }).toArray()

    const applications = await db
      .collection("applications")
      .find({ campaignId: { $in: campaigns.map((c: any) => c._id?.toString()) } })
      .toArray()

    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c: any) => c.status === "active").length,
      totalApplications: applications.length,
      approvedApplications: applications.filter((a: any) => a.status === "Approved").length,
      totalSpent: campaigns.reduce((sum: number, c: any) => sum + c.paymentAmount, 0),
      walletBalance: 500000,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
