'use client'

import React, { useState } from 'react'

const ReadingGoalForm = ({ userId, currentGoal, onGoalSet }) => {
  const [goal, setGoal] = useState(currentGoal || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!goal || goal <= 0) {
      setError('Please enter a valid goal.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reading-goal`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, goal: Number(goal) }),
        }
      )

      if (!res.ok) throw new Error('Failed to set goal')

      const data = await res.json()
      onGoalSet(data) // Update parent component
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center">
      <input
        type="number"
        min={1}
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Set your reading goal"
        className="border px-3 py-2 rounded-md w-40 text-center"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md mt-1"
      >
        {loading ? 'Saving...' : currentGoal ? 'Update Goal' : 'Set Goal'}
      </button>
    </form>
  )
}

export default ReadingGoalForm
