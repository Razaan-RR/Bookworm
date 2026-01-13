import Follow from '@/models/Follow'
import Activity from '@/models/Activity'
import User from '@/models/User'
import Book from '@/models/Book'
import { connectDB } from '@/lib/db'

export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  // Get followed users
  const follows = await Follow.find({ followerId: userId })
  const followingIds = follows.map((f) => f.followingId)

  // Get their activities
  const activities = await Activity.find({
    userId: { $in: followingIds },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()

  // Attach user + book info
  const users = await User.find({ _id: { $in: followingIds } }).lean()
  const books = await Book.find({}).lean()

  const feed = activities.map((act) => {
    const user = users.find((u) => u._id.toString() === act.userId)
    const book = books.find((b) => b._id.toString() === act.bookId)

    return {
      ...act,
      userName: user?.name,
      userImage: user?.image,
      bookTitle: book?.title,
      bookCover: book?.coverImage,
    }
  })

  return Response.json(feed)
}
