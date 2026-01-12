import { connectToDatabase } from '@/lib/db'
import { NextResponse } from 'next/server'

// Public GET books (no auth)
export async function GET() {
  try {
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
