import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const submissionData = await req.json()

    const result = await db.collection("submissions").insertOne({
      ...submissionData,
      reviewStatus: "pending",
      submittedAt: new Date(),
      updatedAt: new Date(),
    })

    // Update application status to Submitted
    await db
      .collection("applications")
      .updateOne({ _id: submissionData.applicationId }, { $set: { status: "Submitted", submittedAt: new Date() } })

    return NextResponse.json({ message: "Content submitted successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json({ error: "Failed to submit content" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()
    const influencerId = req.nextUrl.searchParams.get("influencerId")

    const submissions = await db.collection("submissions").find({ influencerId }).toArray()

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Failed to fetch submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}
