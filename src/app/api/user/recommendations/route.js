import { connectDB } from '@/lib/db'
import UserLibrary from '@/models/UserLibrary'
import Book from '@/models/Book'
import mongoose from 'mongoose'

export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new Response(JSON.stringify({ error: 'No userId provided' }), {
        status: 400,
      })
    }

    const userObjectId = new mongoose.Types.ObjectId(userId)

    // Fetch user's "read" books
    const readBooks = await UserLibrary.find({
      userId: userObjectId,
      shelf: 'read',
    }).lean()

    let recommendedBooks = []

    if (readBooks.length >= 3) {
      // Get array of read book IDs as ObjectId
      const readBookIds = readBooks.map(
        (rb) => new mongoose.Types.ObjectId(rb.bookId)
      )

      // Get full Book documents for the read books
      const readBooksFull = await Book.find({
        _id: { $in: readBookIds },
      }).lean()

      // Count genres
      const genreCounts = {}
      readBooksFull.forEach((b) => {
        const genreIdStr = b.genreId.toString()
        genreCounts[genreIdStr] = (genreCounts[genreIdStr] || 0) + 1
      })

      // Determine the top genre
      const topGenreIdStr = Object.entries(genreCounts).sort(
        (a, b) => b[1] - a[1]
      )[0][0]
      const topGenreId = new mongoose.Types.ObjectId(topGenreIdStr)

      // Recommend books in top genre, excluding already read
      recommendedBooks = await Book.find({
        genreId: topGenreId,
        _id: { $nin: readBookIds },
      })
        .limit(12)
        .lean()
    } else {
      // Fallback: mix of popular + random books
      recommendedBooks = await Book.aggregate([
        { $sample: { size: 12 } }, // random 12 books
      ])
    }

    return new Response(JSON.stringify(recommendedBooks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Recommendations API error:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch recommendations' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
