'use client'

import Image from 'next/image'
import React from 'react'

export default function RecommendationsSection({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return <p className="text-gray-500">No recommendations available yet.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {recommendations.map((book) => (
        <div
          key={book._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 flex flex-col items-center"
        >
          <Image
            src={book.coverImage}
            alt={book.title}
            width={150}
            height={220}
            className="object-cover rounded-md mb-2"
          />
          <h3 className="text-sm font-semibold text-center text-gray-900 dark:text-white">
            {book.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
            {book.author}
          </p>
        </div>
      ))}
    </div>
  )
}
