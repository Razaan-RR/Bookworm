import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/getCurrentUser'

// GET single book
export async function GET(req, { params }) {
  try {
    const { id } = params
    const db = await connectToDatabase()

    const book = await db.collection('books').findOne({
      _id: new ObjectId(id),
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  }
}

// UPDATE book (Admin only)
export async function PUT(req, { params }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    const db = await connectToDatabase()

    const result = await db.collection('books').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Book updated successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

// DELETE book (Admin only)
export async function DELETE(req, { params }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const db = await connectToDatabase()

    const result = await db.collection('books').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
