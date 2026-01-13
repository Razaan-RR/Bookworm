// src/lib/fetchUserReadingStats.js
import { connectDB } from './db'
import Library from '@/models/Library'

export async function fetchUserReadingStats(userId) {
  await connectDB()

  // Fetch user shelves (Want to Read, Currently Reading, Read)
  const userLibrary = await Library.findOne({ userId })

  if (!userLibrary) {
    return {
      annualGoal: 0,
      booksRead: 0,
      pagesRead: 0,
      avgRating: 0,
      favoriteGenre: null,
      streak: 0,
    }
  }

  const booksReadShelf = userLibrary.shelves.find((s) => s.name === 'Read') || {
    books: [],
  }
  const booksRead = booksReadShelf.books.length
  const pagesRead = booksReadShelf.books.reduce(
    (acc, book) => acc + (book.pagesRead || 0),
    0
  )
  const avgRating =
    booksReadShelf.books.length > 0
      ? (
          booksReadShelf.books.reduce(
            (acc, book) => acc + (book.userRating || 0),
            0
          ) / booksReadShelf.books.length
        ).toFixed(1)
      : 0

  // Find favorite genre
  const genreCounts = {}
  booksReadShelf.books.forEach((book) => {
    if (book.genre) genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1
  })
  const favoriteGenre = Object.keys(genreCounts).reduce(
    (a, b) => (genreCounts[a] > genreCounts[b] ? a : b),
    null
  )

  // For demonstration, you can store streak and annualGoal in user profile or calculate dynamically
  const annualGoal = userLibrary.annualGoal || 50 // default 50 books per year
  const streak = userLibrary.streak || 0

  return {
    annualGoal,
    booksRead,
    pagesRead,
    avgRating,
    favoriteGenre,
    streak,
  }
}
