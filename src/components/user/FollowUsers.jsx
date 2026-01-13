'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function FollowUsers({ currentUserId }) {
  const [users, setUsers] = useState([])
  const [followingIds, setFollowingIds] = useState([])

  // Fetch all users except current
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/all')
        const data = await res.json()
        const filtered = data.filter((u) => u._id !== currentUserId)
        setUsers(filtered)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load users')
      }
    }

    fetchUsers()
  }, [currentUserId])

  // Fetch current following
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(`/api/user/following?userId=${currentUserId}`)
        const data = await res.json()
        setFollowingIds(data) // array of following IDs
      } catch (err) {
        console.error(err)
      }
    }

    fetchFollowing()
  }, [currentUserId])

  const toggleFollow = async (targetUserId) => {
    const isFollowing = followingIds.includes(targetUserId)

    try {
      const res = await fetch('/api/user/follow', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: targetUserId,
        }),
      })

      const data = await res.json()

      if (data.success || data.message === 'Already following') {
        // Update UI
        setFollowingIds((prev) =>
          isFollowing
            ? prev.filter((id) => id !== targetUserId)
            : [...prev, targetUserId]
        )
        toast.success(isFollowing ? 'Unfollowed' : 'Followed successfully')
      } else {
        toast.error(data.error || 'Action failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Discover Readers</h2>
      <div className="space-y-2">
        {users.map((u) => {
          const isFollowing = followingIds.includes(u._id)
          return (
            <div
              key={u._id}
              className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <button
                onClick={() => toggleFollow(u._id)}
                className={`px-3 py-1 text-sm rounded ${
                  isFollowing
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
