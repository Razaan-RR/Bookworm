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
          image: user.image || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.email = token.email
      session.user.name = token.name
      return session
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/login`
    },
  },

  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
