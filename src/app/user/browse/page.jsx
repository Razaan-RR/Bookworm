'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function BrowseBooksPage() {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 8

  // Fetch books & genres from user API
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/user/books')
      const data = await res.json()
      setBooks(data.books || [])
      setGenres(data.genres || [])
    } catch (error) {
      console.error(error)
      setBooks([])
      setGenres([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Filter books by search and selected genre
  const filteredBooks = (books || [])
    .filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (book) =>
        selectedGenre === 'all' ||
        (book.genre && book.genre._id.toString() === selectedGenre)
    )

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen px-4 py-6 md:px-8 bg-[var(--bg)] text-[var(--text)] overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
            Browse Books
          </h1>
          <p className="text-sm text-[var(--text)]/70 mt-1">
            Discover new books, filter by genre, and search by title or author
          </p>
        </div>

        {/* Search & Genre Filter */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl border border-white/20 bg-white/30 dark:bg-black/20 text-[var(--text)] placeholder:text-[var(--text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 rounded-xl border border-white/20 bg-white/30 dark:bg-black/20 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Genres</option>
            {(genres || []).map((genre) => (
              <option key={genre._id} value={genre._id.toString()}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="relative rounded-2xl p-4 md:p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/20 shadow-xl">
        {loading ? (
          <div className="flex justify-center py-20 text-[var(--text)]/70">
            Loading books...
          </div>
        ) : currentBooks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-[var(--text)]/70">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-lg font-semibold">No books found</h2>
            <p className="text-sm mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentBooks.map((book) => (
              <motion.div
                key={book._id}
                whileHover={{ scale: 1.03 }}
                className="p-4 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-md flex flex-col"
              >
                <Image
                  src={book.coverImage || '/default-cover.png'}
                  alt={book.title}
                  width={400}
                  height={300}
                  className="h-48 w-full object-cover rounded-lg mb-3"
                />
                <p className="mt-1 text-xs text-[var(--text)]/60">
                  Genre: {book.genre?.name || 'Unknown'}
                </p>
                <h3 className="font-semibold text-[var(--primary)]">
                  {book.title}
                </h3>
                <p className="text-sm text-[var(--text)]/70">{book.author}</p>

                {/* View Details Button */}
                <button
                  onClick={() => (window.location.href = `/books/${book._id}`)}
                  className="mt-3 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold transition-colors"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-xl ${
                  currentPage === num
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-white/30 dark:bg-black/20 text-[var(--text)] hover:bg-[var(--primary)] hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
