import { connectDB } from '@/lib/db'
import Library from '@/models/Library'

export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId)
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
    })

  try {
    const stats = await Library.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$userId',
          booksRead: { $sum: 1 },
          pagesRead: { $sum: '$pagesRead' },
          avgRating: { $avg: '$rating' },
          favoriteGenre: { $first: '$genre' },
        },
      },
    ])

    const result = stats[0] || {
      booksRead: 0,
      pagesRead: 0,
      avgRating: 0,
      favoriteGenre: 'N/A',
    }
    result.annualGoal = 50
    result.streak = 0
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
    })
  }
}
