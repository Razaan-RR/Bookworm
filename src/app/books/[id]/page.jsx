'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function BookDetailsPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBook = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/user/books/${id}`)
      const data = await res.json()

      if (res.ok) {
        setBook(data.book)
      } else {
        setError(data.error || 'Book not found')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch book')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    fetchBook()
  }, [id])

  const handleAddToShelf = async (shelf) => {
    if (!shelf) return
    try {
      const res = await fetch('/api/user/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book._id, shelf }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Book added to your library')
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to add book to library')
    }
  }

  if (loading) return <p className="text-center mt-20">Loading book...</p>
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-screen px-4 py-6 md:px-8 bg-[var(--bg)] text-[var(--text)]"
      >
        <div className="max-w-4xl mx-auto bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row gap-6">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <Image
              src={book.coverImage || '/default-cover.png'}
              alt={book.title}
              width={300}
              height={450}
              className="rounded-xl object-cover w-full md:w-[300px] h-[450px]"
            />
          </div>

          {/* Book Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
                {book.title}
              </h1>
              <p className="text-sm text-[var(--text)]/70 mt-1">
                by {book.author}
              </p>
              <p className="text-xs text-[var(--text)]/60 mt-1">
                Genre: {book.genre?.name || 'Unknown'}
              </p>
              <p className="mt-4 text-[var(--text)]">{book.description}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-4 flex-wrap">
              {/* Add to Shelf Dropdown */}
              <select
                onChange={(e) => handleAddToShelf(e.target.value)}
                className="px-4 py-2 rounded-xl border border-white/20 bg-white/30 dark:bg-black/20 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                defaultValue=""
              >
                <option value="" disabled>
                  Add to Shelf
                </option>
                <option value="want">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="read">Read</option>
              </select>

              {/* Write Review Button */}
              <button className="px-4 py-2 rounded-xl border border-white/20 bg-white/30 dark:bg-black/20 text-[var(--text)] hover:bg-[var(--primary)] hover:text-white">
                Write Review
              </button>
            </div>

            {/* Reviews Section */}
            <div className="mt-6">
              <h2 className="font-semibold text-[var(--primary)] mb-2">
                Reviews
              </h2>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-[var(--text)]/70">
                  ⭐⭐⭐⭐ – Great read!
                </p>
                <p className="text-sm text-[var(--text)]/70">
                  ⭐⭐⭐⭐⭐ – Could not put it down.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
