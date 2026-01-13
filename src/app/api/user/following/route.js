import { connectDB } from '@/lib/db'
import Follow from '@/models/Follow'
import mongoose from 'mongoose'

export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId required' }), {
        status: 400,
      })
    }

    const userObjId = new mongoose.Types.ObjectId(userId)

    const following = await Follow.find({ follower: userObjId }).select(
      'following'
    )

    const followingIds = following.map((f) => f.following.toString())

    return new Response(JSON.stringify(followingIds), { status: 200 })
  } catch (err) {
    console.error('Following GET error:', err)
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 })
  }
}
