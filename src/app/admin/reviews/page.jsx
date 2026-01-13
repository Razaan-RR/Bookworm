'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()
      if (res.ok) setReviews(data)
      else toast.error(data.error)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (reviewId, action) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message)
        fetchReviews()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to perform action')
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-screen px-4 py-6 md:px-8 bg-[var(--bg)] text-[var(--text)]"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
              Review Moderation
            </h1>
            <p className="text-sm text-[var(--text)]/70 mt-1">
              Approve or delete user-submitted reviews
            </p>
          </div>
        </div>

        {/* Reviews container */}
        <div
          className="
            relative
            rounded-2xl
            p-4 md:p-6
            bg-white/40 dark:bg-black/30
            backdrop-blur-xl
            border border-white/20
            shadow-xl
          "
        >
          {loading ? (
            <div className="flex justify-center py-20 text-[var(--text)]/70">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-[var(--text)]/70">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-lg font-semibold">No pending reviews</h2>
              <p className="text-sm mt-1">
                All user reviews are approved or deleted.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {reviews.map((r) => (
                <motion.div
                  key={r._id}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-md flex flex-col gap-2"
                >
                  <p className="text-sm text-[var(--text)]/60">
                    <strong>User:</strong> {r.userId?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-[var(--text)]/60">
                    <strong>Email:</strong> {r.userId?.email || '-'}
                  </p>
                  <p className="text-sm text-[var(--text)]/60">
                    <strong>Book:</strong> {r.bookId?.title || '-'}
                  </p>
                  <p className="text-[var(--text)] mt-2">{r.text}</p>
                  <p className="text-xs text-[var(--text)]/50 mt-1">
                    Rating: {'⭐'.repeat(r.rating)} ({r.rating})
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAction(r._id, 'approve')}
                      className="flex-1 px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(r._id, 'delete')}
                      className="flex-1 px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
