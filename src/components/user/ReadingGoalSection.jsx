'use client' // Must be at the very top
import React, { useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import toast from 'react-hot-toast'

export default function ReadingGoalSection({ userId }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const getStats = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/user/reading-stats?userId=${userId}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load reading stats')
        toast.error('Failed to load reading stats')
      } finally {
        setLoading(false)
      }
    }

    getStats()
  }, [userId])

  if (loading) return <p>Loading your reading goal...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const progress = Math.min(
    Math.round((stats.booksRead / stats.annualGoal) * 100),
    100
  )

  return (
    <div className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Your Reading Goal 📚</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-36 h-36">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              pathColor: 'var(--accent)',
              textColor: 'var(--text)',
              trailColor: 'rgba(255,255,255,0.2)',
            })}
          />
        </div>
        <div className="flex-1 space-y-2">
          <p>
            Annual Goal: <b>{stats.annualGoal}</b>
          </p>
          <p>
            Books Read: <b>{stats.booksRead}</b>
          </p>
          <p>
            Total Pages Read: <b>{stats.pagesRead}</b>
          </p>
          <p>
            Average Rating: <b>{stats.avgRating}/5</b>
          </p>
          <p>
            Favorite Genre: <b>{stats.favoriteGenre}</b>
          </p>
          <p>
            Reading Streak: <b>{stats.streak} days</b>
          </p>
        </div>
      </div>
    </div>
  )
}
