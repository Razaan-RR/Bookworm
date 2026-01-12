'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AddGenreModal from '@/components/admin/AddGenreModal'
import EditGenreModal from '@/components/admin/EditGenreModal'

export default function ManageGenresPage() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState(null)

  const fetchGenres = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/genres')
      const data = await res.json()
      setGenres(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (genre) => {
    setSelectedGenre(genre)
    setEditModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this genre?')) return

    try {
      const res = await fetch(`/api/admin/genres/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) fetchGenres()
      else alert(data.error)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen px-4 py-6 md:px-8 bg-[var(--bg)] text-[var(--text)]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
            Manage Genres
          </h1>
          <p className="text-sm text-[var(--text)]/70 mt-1">
            Add, edit, and organize book genres
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="
            px-5 py-2.5 rounded-xl
            bg-[var(--primary)] text-white
            hover:bg-[var(--accent)]
            transition-all duration-300
            shadow-lg hover:shadow-xl
            active:scale-95
          "
        >
          + Add Genre
        </button>
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
            Loading genres...
          </div>
        ) : genres.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-[var(--text)]/70">
            <div className="text-5xl mb-4">🏷️</div>
            <h2 className="text-lg font-semibold">No genres added yet</h2>
            <p className="text-sm mt-1">Start by adding your first genre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {genres.map((genre) => (
              <motion.div
                key={genre._id}
                whileHover={{ scale: 1.03 }}
                className="p-4 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-md flex flex-col"
              >
                <h3 className="font-semibold text-[var(--primary)]">
                  {genre.name}
                </h3>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(genre)}
                    className="px-3 py-1 text-sm rounded bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(genre._id)}
                    className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddGenreModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onGenreAdded={fetchGenres}
      />

      {selectedGenre && (
        <EditGenreModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          genre={selectedGenre}
          onGenreUpdated={fetchGenres}
        />
      )}
    </motion.div>
  )
}
