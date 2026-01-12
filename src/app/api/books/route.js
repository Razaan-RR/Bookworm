import { connectToDatabase } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await connectToDatabase()
    const books = await db
      .collection('books')
      .find()
      .sort({ createdAt: -1 }) 
      .toArray()
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

    const { title, author, genreId, description, coverImage } = await req.json()

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
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id, title, author, genreId, description, coverImage } =
      await req.json()

    if (!id || !title || !author || !genreId || !description || !coverImage) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const result = await db.collection('books').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          author,
          genreId,
          description,
          coverImage,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Book updated successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const result = await db
      .collection('books')
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
