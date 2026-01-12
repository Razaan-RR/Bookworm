'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AddBookModal({ isOpen, onClose, onBookAdded }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genreId: '',
    description: '',
    coverImage: '',
  })
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        onBookAdded() // refresh book list
        onClose()
        setForm({
          title: '',
          author: '',
          genreId: '',
          description: '',
          coverImage: '',
        })
      } else {
        alert(data.error || 'Failed to add book')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to add book')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-[var(--bg)] text-[var(--text)] rounded-2xl p-6 w-full max-w-lg shadow-2xl backdrop-blur-xl border border-white/20"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
          Add New Book
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="p-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            className="p-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm"
            required
          />
          <input
            type="text"
            name="genreId"
            placeholder="Genre"
            value={form.genreId}
            onChange={handleChange}
            className="p-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return
              setSubmitting(true)
              try {
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch('/api/upload-image', {
                  method: 'POST',
                  body: formData,
                })
                const data = await res.json()
                if (data.url) {
                  setForm({ ...form, coverImage: data.url })
                } else {
                  alert(data.error || 'Image upload failed')
                }
              } catch (err) {
                console.error(err)
                alert('Image upload failed')
              } finally {
                setSubmitting(false)
              }
            }}
            className="p-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm"
          />
          {form.coverImage && (
            <Image
              src={form.coverImage}
              alt="Cover Preview"
              width={96} 
              height={128}
              className="rounded-md mt-2 object-cover"
            />
          )}

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm"
            rows={3}
            required
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/30 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition"
            >
              {submitting ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
