import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import UserLibrary from '@/models/UserLibrary'
import Book from '@/models/Book'
import { getCurrentUser } from '@/lib/getCurrentUser'

export async function GET() {
  try {
    // Connect to MongoDB via Mongoose
    await connectDB()

    // Get current logged-in user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's library with book details
    const library = await UserLibrary.find({ userId: currentUser._id })
      .populate('bookId')
      .sort({ updatedAt: -1 })
      .lean() // convert to plain JS objects, faster and safer

    return NextResponse.json(library)
  } catch (error) {
    console.error('Fetch library error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user library' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { bookId, shelf } = body

    if (!bookId || !shelf) {
      return NextResponse.json(
        { error: 'bookId and shelf are required' },
        { status: 400 }
      )
    }

    const validShelves = ['want', 'reading', 'read']
    if (!validShelves.includes(shelf)) {
      return NextResponse.json(
        { error: 'Invalid shelf value' },
        { status: 400 }
      )
    }

    const bookExists = await Book.findById(bookId)
    if (!bookExists) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Upsert: add or update the library entry
    const libraryEntry = await UserLibrary.findOneAndUpdate(
      { userId: currentUser._id, bookId },
      { shelf, progress: shelf === 'read' ? 100 : 0 },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean()

    return NextResponse.json({
      message: 'Book added to your library',
      data: libraryEntry,
    })
  } catch (error) {
    console.error('Add to library error:', error)
    return NextResponse.json(
      { error: 'Failed to add book to library' },
      { status: 500 }
    )
  }
}
