import { connectToDatabase } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/getCurrentUser'

// GET /api/admin/genres
export async function GET() {
  try {
    const db = await connectToDatabase()
    const genres = await db.collection('genres').find({}).toArray()
    return NextResponse.json(genres)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    )
  }
}

// POST /api/admin/genres
export async function POST(req) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const db = await connectToDatabase()
    const result = await db
      .collection('genres')
      .insertOne({ ...body, createdAt: new Date() })

    return NextResponse.json({ message: 'Genre added', _id: result.insertedId })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add genre' }, { status: 500 })
  }
}
