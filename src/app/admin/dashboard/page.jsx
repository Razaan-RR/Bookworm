'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    pendingReviews: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (res.ok !== false) setStats(data)
      else toast.error(data.error)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

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
            Admin Dashboard
          </h1>
          <p className="text-sm text-[var(--text)]/70 mt-1">
            Overview of your books, users, and pending reviews
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-[var(--text)]/70 col-span-full text-center">
            Loading stats...
          </p>
        ) : (
          <>
            {/* Total Books */}
            <div className="p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-[var(--primary)]">
                {stats.totalBooks}
              </div>
              <div className="text-[var(--text)]/70 mt-1 text-center">
                Total Books
              </div>
            </div>

            {/* Total Users */}
            <div className="p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-[var(--primary)]">
                {stats.totalUsers}
              </div>
              <div className="text-[var(--text)]/70 mt-1 text-center">
                Total Users
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-[var(--primary)]">
                {stats.pendingReviews}
              </div>
              <div className="text-[var(--text)]/70 mt-1 text-center">
                Pending Reviews
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
