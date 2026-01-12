import { connectToDatabase } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/getCurrentUser'

// GET all books (allowed for all logged-in users later)
export async function GET() {
  try {
    const db = await connectToDatabase()
    const books = await db.collection('books').find().toArray()
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// POST create a book (Admin only)
export async function POST(req) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { title, author, genreId, description, coverImage } = body

    if (!title || !author || !genreId || !description || !coverImage) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()

    const newBook = {
      title,
      author,
      genreId,
      description,
      coverImage,
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('books').insertOne(newBook)

    return NextResponse.json({
      message: 'Book created successfully',
      bookId: result.insertedId,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}
