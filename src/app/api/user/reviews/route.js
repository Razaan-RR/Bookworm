import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'
import Book from '@/models/Book'
import { getCurrentUser } from '@/lib/getCurrentUser'

export async function GET(req) {
  try {
    await connectDB()
    const bookId = req.nextUrl.searchParams.get('bookId')
    if (!bookId)
      return NextResponse.json({ error: 'BookId required' }, { status: 400 })

    // Only fetch approved reviews
    const reviews = await Review.find({ bookId, status: 'approved' })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(reviews)
  } catch (err) {
    console.error('Fetch reviews error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const currentUser = await getCurrentUser()
    if (!currentUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { bookId, rating, text } = await req.json()
    if (!bookId || !rating || !text) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const bookExists = await Book.findById(bookId)
    if (!bookExists)
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })

    const review = await Review.create({
      bookId,
      userId: currentUser._id,
      rating,
      text,
      status: 'pending', // Admin needs to approve
    })

    return NextResponse.json({
      message: 'Review submitted for approval',
      review,
    })
  } catch (err) {
    console.error('Add review error:', err)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
