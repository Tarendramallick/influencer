import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectDB()
    const campaigns = await db.collection("campaigns").find({}).toArray()

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error("Failed to fetch campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectDB()
    const campaignData = await req.json()

    const result = await db.collection("campaigns").insertOne({
      ...campaignData,
      paymentAmount: Number.parseFloat(campaignData.paymentAmount),
      deadline: new Date(campaignData.deadline),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Campaign created successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Campaign creation error:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
