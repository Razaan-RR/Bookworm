'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

export default function UserTutorialsPage() {
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTutorials = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/tutorials') // user-facing API
      const data = await res.json()
      setTutorials(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch tutorials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTutorials()
  }, [])

  // Extract YouTube ID for embedding
  const extractYoutubeId = (url) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen px-4 py-6 md:px-8 bg-[var(--bg)] text-[var(--text)]"
    >
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
            Book Tutorials
          </h1>
          <p className="text-sm text-[var(--text)]/70 mt-1">
            Watch tutorials related to books
          </p>
        </div>
      </div>

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
            Loading tutorials...
          </div>
        ) : tutorials.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-[var(--text)]/70">
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-lg font-semibold">
              No tutorials available yet
            </h2>
            <p className="text-sm mt-1">Check back later for new tutorials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tutorials.map((t) => (
              <motion.div
                key={t._id}
                whileHover={{ scale: 1.03 }}
                className="p-4 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-md flex flex-col"
              >
                <p className="text-sm mt-1 text-[var(--text)]/70">
                  <strong>Book:</strong> {t.bookId?.title || 'Unknown'}
                </p>
                <p className="text-sm mt-1 text-[var(--text)]/70">
                  <strong>Description:</strong> {t.description}
                </p>

                {extractYoutubeId(t.youtubeUrl) && (
                  <div className="mt-2 aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(
                        t.youtubeUrl
                      )}`}
                      title={t.title}
                      allowFullScreen
                      className="w-full h-full rounded"
                    ></iframe>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
