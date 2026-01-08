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
    const { conversationId, content } = await req.json()

    const db = await connectDB()

    const message = {
      conversationId,
      senderId: decoded.userId,
      senderRole: decoded.role,
      content,
      read: false,
      createdAt: new Date(),
    }

    await db.collection("messages").insertOne(message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
