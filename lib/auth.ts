import bcrypt from "bcryptjs"
import { connectDB } from "./db"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function getUserByEmail(email: string) {
  const db = await connectDB()
  return db.collection("users").findOne({ email })
}

export async function createUser(email: string, password: string, role: string) {
  const db = await connectDB()
  const hashedPassword = await hashPassword(password)

  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  })

  return result
}
