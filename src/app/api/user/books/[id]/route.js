import { connectToDatabase } from '@/lib/db'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(req, context) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // In App Router, context.params is a Promise in Next.js 14+
    const params = await context.params
    const { id } = params

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 })
    }

    const db = await connectToDatabase()

    const book = await db.collection('books').findOne({ _id: new ObjectId(id) })
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Attach genre object
    let genre = null
    if (book.genreId) {
      genre = await db
        .collection('genres')
        .findOne({ _id: new ObjectId(book.genreId) })
    }

    return NextResponse.json({ book: { ...book, genre } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  }
}
