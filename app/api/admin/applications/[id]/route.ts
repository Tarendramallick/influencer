import { connectDB } from "@/lib/db"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB()
    const { status } = await req.json()

    const result = await db.collection("applications").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          reviewedAt: new Date(),
          ...(status === "Approved" && { approvedAt: new Date() }),
        },
      },
    )

    return NextResponse.json({
      message: "Application updated successfully",
    })
  } catch (error) {
    console.error("Failed to update application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
