import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const { campaignId, influencerId } = await req.json()

    // Get influencer details
    const influencer = await db.collection("influencers").findOne({ userId: influencerId })

    const result = await db.collection("applications").insertOne({
      campaignId,
      influencerId,
      influencerName: influencer?.name || "Unknown",
      influencerEmail: influencer?.email || "",
      status: "Applied",
      appliedAt: new Date(),
    })

    return NextResponse.json({ message: "Application submitted successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Application error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()
    const influencerId = req.nextUrl.searchParams.get("influencerId")

    const applications = await db.collection("applications").find({ influencerId }).toArray()

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Failed to fetch applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
