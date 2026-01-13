import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import UserLibrary from '@/models/UserLibrary'
import Book from '@/models/Book'
import { getCurrentUser } from '@/lib/getCurrentUser'

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

    const libraryEntry = await UserLibrary.findOneAndUpdate(
      { userId: currentUser._id, bookId },
      {
        shelf,
        progress: shelf === 'read' ? 100 : 0,
      },
      { upsert: true, new: true }
    )

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
