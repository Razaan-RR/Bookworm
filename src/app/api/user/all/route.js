import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function GET() {
  await connectDB()
  const users = await User.find({}, '_id name email').lean()
  return Response.json(users)
}
