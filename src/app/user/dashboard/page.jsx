// app/user/dashboard/page.jsx
import React from 'react'
import { getCurrentUser } from '@/lib/getCurrentUser'
import RecommendationsSection from '@/components/user/RecommendationsSection'
import { connectDB } from '@/lib/db'

const DashboardPage = async () => {
  await connectDB()
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return <p className="text-center mt-10">User not found</p>
  }

  const userId = currentUser._id || currentUser.id

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/recommendations?userId=${String(
      userId
    )}`,
    { cache: 'no-store' }
  )

  const recommendations = await res.json()

  return (
    <div className="p-4 md:p-6 space-y-8">
      <section>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Recommended Books
        </h2>

        <RecommendationsSection recommendations={recommendations} />
      </section>
    </div>
  )
}

export default DashboardPage
