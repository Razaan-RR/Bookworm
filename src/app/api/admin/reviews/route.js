import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'
import Book from '@/models/Book'
import '@/models/User' // just import to register schema

export async function GET() {
  try {
    await connectDB()

    const reviews = await Review.find({ approved: false })
      .populate('userId', 'name email') // now User schema exists
      .populate('bookId', 'title')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(reviews)
  } catch (err) {
    console.error('Fetch admin reviews error:', err)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    await connectDB()
    const { reviewId, action } = await req.json()

    if (!reviewId || !action)
      return NextResponse.json({ error: 'reviewId and action are required' }, { status: 400 })

    const review = await Review.findById(reviewId)
    if (!review)
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })

    if (action === 'approve') {
      review.approved = true
      await review.save()
      return NextResponse.json({ message: 'Review approved' })
    }

    if (action === 'delete') {
      await Review.findByIdAndDelete(reviewId)
      return NextResponse.json({ message: 'Review deleted' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Admin review action error:', err)
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 })
  }
}
