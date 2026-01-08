import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const profileData = await req.json()

    const result = await db.collection("influencers").insertOne({
      ...profileData,
      profileVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Profile created successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Profile creation error:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
