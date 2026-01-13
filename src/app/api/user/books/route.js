import { connectToDatabase } from '@/lib/db'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const db = await connectToDatabase()

    // Fetch all books
    const books = await db.collection('books').find({}).toArray()

    // Fetch all genres
    const genres = await db.collection('genres').find({}).toArray()

    // Attach genre object to each book using genreId
    const booksWithGenre = books.map((book) => {
      const genreObj = genres.find(
        (g) => g._id.toString() === book.genreId?.toString()
      )
      return { ...book, genre: genreObj || null }
    })

    return NextResponse.json({ books: booksWithGenre, genres })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}
