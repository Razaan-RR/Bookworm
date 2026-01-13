import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Tutorial from '@/models/Tutorial'
import '@/models/Book' // register Book model

// GET: fetch all tutorials
export async function GET() {
  try {
    await connectDB()
    const tutorials = await Tutorial.find()
      .populate('bookId', 'title')
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json(tutorials)
  } catch (err) {
    console.error('Admin fetch tutorials error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tutorials' },
      { status: 500 }
    )
  }
}

// POST: create a new tutorial
export async function POST(req) {
  try {
    await connectDB()

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { bookId, title, youtubeUrl, description } = body
    if (!bookId || !title || !youtubeUrl)
      return NextResponse.json(
        { error: 'bookId, title, and youtubeUrl are required' },
        { status: 400 }
      )

    const tutorial = await Tutorial.create({
      bookId,
      title,
      youtubeUrl,
      description,
    })
    return NextResponse.json({ success: true, tutorial }, { status: 201 })
  } catch (err) {
    console.error('Admin create tutorial error:', err)
    return NextResponse.json(
      { error: 'Failed to create tutorial' },
      { status: 500 }
    )
  }
}

// PATCH: update a tutorial
export async function PATCH(req) {
  try {
    await connectDB()

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { id, title, youtubeUrl, description } = body
    if (!id)
      return NextResponse.json(
        { error: 'Tutorial ID required' },
        { status: 400 }
      )

    const tutorial = await Tutorial.findById(id)
    if (!tutorial)
      return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 })

    if (title) tutorial.title = title
    if (youtubeUrl) tutorial.youtubeUrl = youtubeUrl
    if (description !== undefined) tutorial.description = description

    await tutorial.save()
    return NextResponse.json({ success: true, tutorial })
  } catch (err) {
    console.error('Admin update tutorial error:', err)
    return NextResponse.json(
      { error: 'Failed to update tutorial' },
      { status: 500 }
    )
  }
}

// DELETE: remove a tutorial
export async function DELETE(req) {
  try {
    await connectDB()

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { id } = body
    if (!id)
      return NextResponse.json(
        { error: 'Tutorial ID required' },
        { status: 400 }
      )

    await Tutorial.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Tutorial deleted' })
  } catch (err) {
    console.error('Admin delete tutorial error:', err)
    return NextResponse.json(
      { error: 'Failed to delete tutorial' },
      { status: 500 }
    )
  }
}
