import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import UserLibrary from "@/models/UserLibrary"
import Book from "@/models/Book"
import { getCurrentUser } from "@/lib/getCurrentUser"

// GET
export async function GET() {
  await connectDB()

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const library = await UserLibrary.find({
    userId: currentUser.id
  })
    .populate("bookId")
    .sort({ updatedAt: -1 })
    .lean()

  return NextResponse.json(library)
}

// POST
export async function POST(req) {
  await connectDB()

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bookId, shelf } = await req.json()

  if (!bookId || !shelf) {
    return NextResponse.json(
      { error: "bookId and shelf are required" },
      { status: 400 }
    )
  }

  const book = await Book.findById(bookId)
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }

  const libraryEntry = await UserLibrary.findOneAndUpdate(
    { userId: currentUser.id, bookId },
    {
      userId: currentUser.id,      // MUST be set explicitly
      bookId,
      shelf,
      progress: shelf === "read" ? 100 : 0
    },
    { upsert: true, new: true }
  )

  return NextResponse.json(libraryEntry)
}
