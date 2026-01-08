import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined")
}

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

let cachedDb: any = null

export async function connectDB() {
  if (cachedDb) {
    return cachedDb
  }

  try {
    const connection = await client.connect()
    cachedDb = connection.db("influencer_platform")
    return cachedDb
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export async function closeDB() {
  await client.close()
  cachedDb = null
}
