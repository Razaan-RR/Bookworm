'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ManageUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      const res = await fetch(`/api/admin/users/${user._id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (res.ok) fetchUsers()
      else alert(data.error || 'Failed to update role')
    } catch (err) {
      console.error(err)
      alert('Failed to update role')
    }
  }

  useEffect(() => {
    fetchUsers()
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
            User Management
          </h1>
          <p className="text-sm text-[var(--text)]/70 mt-1">
            Manage users and assign roles
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
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-[var(--text)]/70">
            <div className="text-5xl mb-4">👤</div>
            <h2 className="text-lg font-semibold">No users found</h2>
            <p className="text-sm mt-1">
              Users will appear here once they register.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {users.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.03 }}
                className="p-4 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-[var(--primary)]">
                    {user.name}
                  </h3>
                  <p className="text-sm text-[var(--text)]/70">{user.email}</p>
                  <p className="text-sm mt-1 capitalize text-[var(--text)]/80">
                    Role: {user.role}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleToggleRole(user)}
                    className={`px-3 py-1 text-sm rounded ${
                      user.role === 'admin'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {user.role === 'admin'
                      ? 'Demote to User'
                      : 'Promote to Admin'}
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
