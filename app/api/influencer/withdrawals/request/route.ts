import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const { amount, method, upiId } = await req.json()

    const db = await connectDB()

    const withdrawal = {
      influencerId: decoded.userId,
      influencerEmail: decoded.email,
      amount,
      status: "pending",
      paymentMethod: method,
      upiId,
      requestedAt: new Date(),
    }

    await db.collection("withdrawals").insertOne(withdrawal)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Withdrawal request error:", error)
    return NextResponse.json({ error: "Failed to create withdrawal request" }, { status: 500 })
  }
}
