// src/lib/createLibraryForUser.js
import { connectDB } from './db'
import Library from '@/models/Library'

export async function createLibraryForUser(userId) {
  await connectDB()

  const existing = await Library.findOne({ userId })
  if (existing) return existing

  const newLibrary = await Library.create({
    userId,
    shelves: [
      { name: 'Want to Read', books: [] },
      { name: 'Currently Reading', books: [] },
      { name: 'Read', books: [] },
    ],
    annualGoal: 50, // default
    streak: 0,
  })

  return newLibrary
}
