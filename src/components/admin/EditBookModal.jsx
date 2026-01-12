'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function EditBookModal({
  isOpen,
  onClose,
  book,
  onBookUpdated,
}) {
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [coverImage, setCoverImage] = useState(book.coverImage)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/books/${book._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, coverImage }),
      })
      const data = await res.json()
      if (res.ok) {
        onBookUpdated()
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
      <div className="bg-white dark:bg-black rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="p-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="p-2 rounded border"
          />
          {coverImage && (
            <Image
              src={coverImage}
              alt="Cover Preview"
              width={200}
              height={150}
              className="mt-2 object-cover rounded"
            />
          )}
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
