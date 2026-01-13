import { connectToDatabase } from './lib/db.js' // use correct relative path
import { ObjectId } from 'mongodb'

async function fixBookGenres() {
  const db = await connectToDatabase()

  // Fetch all genres
  const genres = await db.collection('genres').find({}).toArray()

  // Fetch all books
  const books = await db.collection('books').find({}).toArray()

  for (const book of books) {
    if (book.genre) {
      // If genre is already an ObjectId, skip
      let genreId = book.genre
      if (typeof genreId !== 'string') {
        genreId = genreId.toString()
      }

      // Try to find the matching genre by id or name
      const matchedGenre = genres.find(
        (g) => g._id.toString() === genreId || g.name === book.genre?.name
      )

      if (matchedGenre) {
        await db.collection('books').updateOne(
          { _id: book._id },
          { $set: { genre: matchedGenre._id } }
        )
      }
    }
  }

  console.log('✅ All book genres fixed successfully.')
  process.exit()
}

fixBookGenres().catch((err) => {
  console.error(err)
  process.exit(1)
})
