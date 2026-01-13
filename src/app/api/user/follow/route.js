import { connectDB } from '@/lib/db'
import Follow from '@/models/Follow'
import Activity from '@/models/Activity'

export async function POST(req) {
  try {
    await connectDB()
    const { followerId, followingId } = await req.json()

    if (!followerId || !followingId) {
      return new Response(
        JSON.stringify({ error: 'followerId and followingId required' }),
        { status: 400 }
      )
    }

    // Check if already following
    const exists = await Follow.findOne({
      followerId: String(followerId),
      followingId: String(followingId),
    })

    if (exists) {
      return new Response(
        JSON.stringify({ message: 'Already following', success: true }),
        { status: 200 }
      )
    }

    // Create follow
    await Follow.create({
      followerId: String(followerId),
      followingId: String(followingId),
    })

    // Log activity for feed
    await Activity.create({
      userId: String(followerId),
      type: 'follow',
      targetUserId: String(followingId),
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('Follow API error:', err)
    return new Response(JSON.stringify({ error: 'Failed to follow' }), {
      status: 500,
    })
  }
}
