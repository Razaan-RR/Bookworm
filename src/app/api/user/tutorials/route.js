import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Tutorial from '@/models/Tutorial'

export async function GET() {
  try {
    await connectDB()

    // fetch all tutorials (for users) - optionally filter only some
    const tutorials = await Tutorial.find({})
      .populate('bookId', 'title') // get the book title
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(tutorials)
  } catch (err) {
    console.error('Fetch user tutorials error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tutorials' },
      { status: 500 }
    )
  }
}
