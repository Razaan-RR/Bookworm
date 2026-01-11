import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        // TEMP: fake login for now (we replace with backend later)
        if (email === "admin@bookworm.com" && password === "123456") {
          return {
            id: 1,
            name: "Admin User",
            email,
            role: "admin",
          };
        }

        if (email === "user@bookworm.com" && password === "123456") {
          return {
            id: 2,
            name: "Normal User",
            email,
            role: "user",
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
