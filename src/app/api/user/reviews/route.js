// src/app/api/user/reviews/route.js
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'
import Book from '@/models/Book'

export async function GET(req) {
  try {
    await connectDB()

    const bookId = req.nextUrl.searchParams.get('bookId')
    if (!bookId)
      return NextResponse.json({ error: 'BookId required' }, { status: 400 })

    // Fetch only approved reviews
    const reviews = await Review.find({ bookId, approved: true }) // <-- make sure 'approved' is correct
      .populate('userId', 'name email image') // include image field
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
