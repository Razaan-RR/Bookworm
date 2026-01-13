'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function MyLibraryPage() {
  const [library, setLibrary] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeShelf, setActiveShelf] = useState('all')

  const fetchLibrary = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/user/library')
      const data = await res.json()
      setLibrary(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch library')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLibrary()
  }, [])

  const filteredLibrary =
    activeShelf === 'all'
      ? library
      : library.filter((item) => item.shelf === activeShelf)

  const shelves = ['all', 'want', 'reading', 'read']

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-screen px-4 py-6 md:px-8 bg-[var(--bg)] text-[var(--text)] overflow-x-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
              My Library
            </h1>
            <p className="text-sm text-[var(--text)]/70 mt-1">
              Track your reading progress and manage your shelves
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {shelves.map((shelf) => (
              <button
                key={shelf}
                onClick={() => setActiveShelf(shelf)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 shadow ${
                  activeShelf === shelf
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-white/30 dark:bg-black/20 text-[var(--text)] hover:bg-[var(--primary)] hover:text-white'
                }`}
              >
                {shelf === 'all'
                  ? 'All'
                  : shelf === 'want'
                  ? 'Want to Read'
                  : shelf === 'reading'
                  ? 'Currently Reading'
                  : 'Read'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl p-4 md:p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/20 shadow-xl">
          {loading ? (
            <div className="flex justify-center py-20 text-[var(--text)]/70">
              Loading library...
            </div>
          ) : filteredLibrary.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-[var(--text)]/70">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-lg font-semibold">No books in this shelf</h2>
              <p className="text-sm mt-1">
                Start adding books or switch to another shelf.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredLibrary.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-md flex flex-col"
                >
                  <Image
                    src={item.bookId.coverImage || '/default-cover.png'}
                    alt={item.bookId.title}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-[var(--primary)]">
                    {item.bookId.title}
                  </h3>
                  <p className="text-sm text-[var(--text)]/70">
                    {item.bookId.author}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text)]/60">
                    Shelf:{' '}
                    {item.shelf.charAt(0).toUpperCase() + item.shelf.slice(1)}
                  </p>

                  {item.shelf === 'reading' && (
                    <div className="mt-2">
                      <div className="w-full h-2 bg-[var(--text)]/20 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-[var(--primary)] rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1 text-[var(--text)]/60">
                        {item.progress}% completed
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
