// // import { getServerSession } from 'next-auth'
// // import { authOptions } from '@/app/api/auth/[...nextauth]/route'
// // import { connectToDatabase } from '@/lib/db'

// // export async function getCurrentUser() {
// //   try {
// //     const session = await getServerSession(authOptions)

// //     if (!session || !session.user?.email) {
// //       return null
// //     }

// //     const db = await connectToDatabase()

// //     const user = await db.collection('users').findOne({
// //       email: session.user.email,
// //     })

// //     if (!user) return null

// //     return {
// //       _id: user._id, // ✅ Use _id for Mongoose
// //       name: user.name,
// //       email: user.email,
// //       role: user.role,
// //     }
// //   } catch (error) {
// //     console.error('getCurrentUser error:', error)
// //     return null
// //   }
// // }
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { connectDB } from "@/lib/db"
// import User from "@/models/User"

// export async function getCurrentUser() {
//   await connectDB()

//   const session = await getServerSession(authOptions)

//   if (!session?.user?.email) {
//     return null
//   }

//   const user = await User.findOne({ email: session.user.email }).lean()

//   if (!user) return null

//   return {
//     id: user._id.toString(),   // VERY IMPORTANT
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     image: user.image || null
//   }
// }

// lib/getCurrentUser.js
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function getCurrentUser() {
  await connectDB()

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const user = await User.findOne({ email: session.user.email }).lean()
  if (!user) return null

  return {
    _id: user._id.toString(), // ✅ make sure it is _id as string
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image || null
  }
}
