import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'

export const authOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const db = await connectToDatabase()
        const user = await db
          .collection('users')
          .findOne({ email: credentials.email })

        if (!user) throw new Error('No user found')

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        )
        if (!isValid) throw new Error('Wrong password')

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
