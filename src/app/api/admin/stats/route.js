import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Book from '@/models/Book'
import User from '@/models/User'
import Review from '@/models/Review'

export async function GET() {
  try {
    await connectDB()

    const totalBooks = await Book.countDocuments()
    const totalUsers = await User.countDocuments()
    const pendingReviews = await Review.countDocuments({ approved: false })

    return NextResponse.json({ totalBooks, totalUsers, pendingReviews })
  } catch (err) {
    console.error('Dashboard stats error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
