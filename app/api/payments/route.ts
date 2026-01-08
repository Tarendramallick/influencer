import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()
    const influencerId = req.nextUrl.searchParams.get("influencerId")

    const payments = await db.collection("payments").find({ influencerId }).toArray()

    return NextResponse.json({ payments })
  } catch (error) {
    console.error("Failed to fetch payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const paymentData = await req.json()

    const result = await db.collection("payments").insertOne({
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Payment recorded successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 })
  }
}
