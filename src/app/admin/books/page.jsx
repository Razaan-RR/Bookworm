'use client'

import { motion } from 'framer-motion'

export default function ManageBooksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen px-4 py-6 md:px-8 bg-[var(--bg)] text-[var(--text)]"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
            Manage Books
          </h1>
          <p className="text-sm text-[var(--text)]/70 mt-1">
            Add, edit, and organize your book collection
          </p>
        </div>

        {/* Add Book Button (UI only for now) */}
        <button
          className="
            px-5 py-2.5 rounded-xl
            bg-[var(--primary)] text-white
            hover:bg-[var(--accent)]
            transition-all duration-300
            shadow-lg hover:shadow-xl
            active:scale-95
          "
        >
          + Add New Book
        </button>
      </div>

      {/* Glass Container */}
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
        {/* Grid Placeholder for Book Cards */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-5
          "
        >
          {/* Empty State Placeholder */}
          <div
            className="
              col-span-full
              flex flex-col items-center justify-center
              py-20
              text-center
              text-[var(--text)]/70
            "
          >
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-lg font-semibold">No books added yet</h2>
            <p className="text-sm mt-1">
              Start by adding your first book to the library.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
