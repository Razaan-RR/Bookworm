import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { getCurrentUser } from '@/lib/getCurrentUser'

export async function PUT(req, { params }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()
    const { role } = body

    if (!role || !['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(id) }, { $set: { role } })

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'User not found or role unchanged' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: `Role updated to ${role}` })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}
