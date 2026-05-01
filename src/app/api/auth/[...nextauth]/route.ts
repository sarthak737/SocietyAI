import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Auto-seed admin account on first login attempt if it doesn't exist
        if (credentials.email === "admin@gmail.com") {
          let admin = await prisma.user.findUnique({ where: { email: "admin@gmail.com" } })
          if (!admin) {
            const hashedPassword = await bcrypt.hash("admin@123", 10)
            admin = await prisma.user.create({
              data: {
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "ADMIN",
                name: "Super Admin",
              }
            })
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          flat_number: user.flat_number,
          phone: user.phone
        } as any
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
        token.flat_number = (user as any).flat_number
        token.phone = (user as any).phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const t = token as any
        ;(session.user as any).role = t.role
        ;(session.user as any).id = t.id
        ;(session.user as any).flat_number = t.flat_number
        ;(session.user as any).phone = t.phone
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
