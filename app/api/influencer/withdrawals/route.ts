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

    const withdrawalHistory = await db.collection("withdrawals").find({ influencerId: decoded.userId }).toArray()

    const summary = {
      availableBalance: 150000,
      pendingWithdrawals: withdrawalHistory
        .filter((w: any) => w.status === "pending")
        .reduce((sum: number, w: any) => sum + w.amount, 0),
      completedWithdrawals: withdrawalHistory
        .filter((w: any) => w.status === "completed")
        .reduce((sum: number, w: any) => sum + w.amount, 0),
    }

    return NextResponse.json({ summary, history: withdrawalHistory })
  } catch (error) {
    console.error("Withdrawals error:", error)
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 })
  }
}
