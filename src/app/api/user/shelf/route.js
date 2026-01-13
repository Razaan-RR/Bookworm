import { connectToDatabase } from '@/lib/db'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function POST(req) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { bookId, shelfType } = body

    if (
      !bookId ||
      !['Want to Read', 'Currently Reading', 'Read'].includes(shelfType)
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if book exists
    const book = await db
      .collection('books')
      .findOne({ _id: new ObjectId(bookId) })
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Update user's shelf
    await db.collection('users').updateOne(
      { _id: new ObjectId(currentUser._id) },
      {
        $addToSet: {
          [`shelves.${shelfType}`]: new ObjectId(bookId),
        },
      }
    )

    return NextResponse.json({ message: `Book added to ${shelfType}` })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 })
  }
}
