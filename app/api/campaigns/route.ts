import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()
    const campaigns = await db.collection("campaigns").find({ status: "active" }).toArray()

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error("Failed to fetch campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const campaignData = await req.json()

    const result = await db.collection("campaigns").insertOne({
      ...campaignData,
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
