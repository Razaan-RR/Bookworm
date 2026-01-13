'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminTutorialsPage() {
  const [books, setBooks] = useState([])
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    bookId: '',
    title: '',
    youtubeUrl: '',
    description: '',
  })

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/admin/books')
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch books')
    }
  }

  const fetchTutorials = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/tutorials')
      const data = await res.json()
      setTutorials(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch tutorials')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!form.bookId || !form.title || !form.youtubeUrl) {
      toast.error('Book, title, and YouTube URL are required')
      return
    }

    try {
      const res = await fetch('/api/admin/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Tutorial added')
        setForm({ bookId: '', title: '', youtubeUrl: '', description: '' })
        fetchTutorials()
      } else toast.error(data.error)
    } catch (err) {
      console.error(err)
      toast.error('Failed to create tutorial')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return
    try {
      const res = await fetch('/api/admin/tutorials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Tutorial deleted')
        fetchTutorials()
      } else toast.error(data.error)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete tutorial')
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchTutorials()
  }, [])

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
            Tutorial Management
          </h1>
          <p className="text-sm text-[var(--text)]/70 mt-1">
            Add, edit, and manage book tutorials
          </p>
        </div>
      </div>

      {/* Add Tutorial Inline Form */}
      <div
        className="
          mb-8 p-4 md:p-6
          bg-white/40 dark:bg-black/30
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          shadow-xl
        "
      >
        <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
          Add Tutorial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={form.bookId}
            onChange={(e) => setForm({ ...form, bookId: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">Select a book for BookID</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="YouTube URL"
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            className="border p-2 rounded w-full"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded w-full col-span-1 md:col-span-2"
          />
        </div>

        <button
          onClick={handleCreate}
          className="
            mt-4 px-5 py-2.5 rounded-xl
            bg-[var(--primary)] text-white
            hover:bg-[var(--accent)]
            transition-all duration-300
            shadow-lg hover:shadow-xl
            active:scale-95
          "
        >
          Add Tutorial
        </button>
      </div>

      {/* Tutorials List */}
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
            <h2 className="text-lg font-semibold">No tutorials added yet</h2>
            <p className="text-sm mt-1">Start by adding your first tutorial.</p>
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

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(t._id)}
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
  )
}
