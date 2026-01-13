'use client'
import { useEffect, useState } from 'react'

export default function ActivityFeed({ userId }) {
  const [feed, setFeed] = useState([])

  useEffect(() => {
    fetch(`/api/user/activity-feed?userId=${userId}`)
      .then((res) => res.json())
      .then(setFeed)
  }, [userId])

  if (!feed.length) {
    return <p className="text-gray-400">No activity yet.</p>
  }

  return (
    <div className="space-y-4">
      {feed.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-gray-800 p-3 rounded"
        >
          <img src={item.userImage} className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-sm">
              <span className="font-bold">{item.userName}</span> {item.message}{' '}
              <span className="font-semibold">({item.bookTitle})</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
