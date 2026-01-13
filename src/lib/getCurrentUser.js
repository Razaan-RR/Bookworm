// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { connectToDatabase } from "@/lib/db";

// export async function getCurrentUser() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user?.email) {
//       return null;
//     }

//     const db = await connectToDatabase();

//     const user = await db.collection("users").findOne({
//       email: session.user.email,
//     });

//     if (!user) return null;

//     return {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     };
//   } catch (error) {
//     return null;
//   }
// }

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/db'

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return null
    }

    const db = await connectToDatabase()

    const user = await db.collection('users').findOne({
      email: session.user.email,
    })

    if (!user) return null

    return {
      _id: user._id, // ✅ Use _id for Mongoose
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}
