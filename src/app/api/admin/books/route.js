import { connectToDatabase } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/getCurrentUser'

// GET all books (Admin only) & POST new book
export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const db = await connectToDatabase()
    const books = await db.collection('books').find({}).toArray()
    return NextResponse.json(books)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const db = await connectToDatabase()

    const result = await db.collection('books').insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      message: 'Book added successfully',
      bookId: result.insertedId,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 })
  }
}
