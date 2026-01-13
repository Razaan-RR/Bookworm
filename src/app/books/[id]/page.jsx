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
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch book details
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

  // Fetch approved reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/user/reviews?bookId=${id}`)
      const data = await res.json()
      if (res.ok) setReviews(data)
    } catch (err) {
      console.error(err)
    }
  }

  // Add book to shelf
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

  // Submit review
  const handleSubmitReview = async () => {
    if (rating === 0 || reviewText.trim() === '') {
      toast.error('Please provide rating and review text')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('/api/user/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: id, rating, text: reviewText }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Review submitted for approval')
        setRating(0)
        setReviewText('')
        fetchReviews()
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!id) return
    fetchBook()
    fetchReviews()
  }, [id])

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
            </div>

            {/* Reviews Section */}
            <div className="mt-6" id="review-form">
              <h2 className="font-semibold text-[var(--primary)] mb-2">
                Reviews
              </h2>

              {/* Review Form */}
              <div className="mb-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl shadow-inner">
                <p className="text-sm mb-2 font-medium">Leave a Review</p>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full p-3 rounded-lg bg-white/30 dark:bg-black/20 text-[var(--text)] placeholder:text-[var(--text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="mt-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

              {/* Display Reviews */}
              <div className="flex flex-col gap-3">
                {reviews.length === 0 ? (
                  <p className="text-sm text-[var(--text)]/70">
                    No reviews yet
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r._id}
                      className="p-3 rounded-xl bg-white/20 dark:bg-black/20 flex items-start gap-3"
                    >
                      {/* User Image */}
                      <Image
                        src={r.userId?.image || '/default-avatar.png'}
                        alt={r.userId?.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-[var(--text)]/60 font-medium">
                          {r.userId?.name || 'Anonymous'} –{' '}
                          {'⭐'.repeat(r.rating)}
                        </p>
                        <p className="text-sm text-[var(--text)]/80">
                          {r.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
