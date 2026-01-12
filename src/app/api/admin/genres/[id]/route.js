import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/getCurrentUser'

// PUT /api/admin/genres/:id
export async function PUT(req, { params }) {
  const { id } = await params
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const db = await connectToDatabase()
    const result = await db
      .collection('genres')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...body, updatedAt: new Date() } }
      )
    if (result.matchedCount === 0)
      return NextResponse.json({ error: 'Genre not found' }, { status: 404 })

    return NextResponse.json({ message: 'Genre updated successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update genre' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/genres/:id
export async function DELETE(req, { params }) {
  const { id } = await params
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const db = await connectToDatabase()
    const result = await db
      .collection('genres')
      .deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0)
      return NextResponse.json({ error: 'Genre not found' }, { status: 404 })

    return NextResponse.json({ message: 'Genre deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete genre' },
      { status: 500 }
    )
  }
}
