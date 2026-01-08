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

    const brand = await db.collection("brands").findOne({ userId: decoded.userId })

    const walletData = {
      balance: brand?.walletBalance || 500000,
      totalSpent: brand?.totalSpent || 0,
      totalRecharged: brand?.totalRecharged || 500000,
    }

    return NextResponse.json(walletData)
  } catch (error) {
    console.error("Wallet error:", error)
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 })
  }
}
