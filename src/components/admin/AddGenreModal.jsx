'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AddGenreModal({ isOpen, onClose, onGenreAdded }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/genres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (res.ok) {
        setName('')
        onGenreAdded()
        onClose()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-[var(--bg)] text-[var(--text)] rounded-2xl p-6 w-full max-w-md shadow-2xl backdrop-blur-xl border border-white/20"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
          Add Genre
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Genre Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
