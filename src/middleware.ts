import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Protect admin routes
        if (pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        // Protect resident routes
        if (pathname.startsWith('/resident')) {
          return !!token
        }
        return true
      }
    },
    pages: {
      signIn: '/login'
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/resident/:path*']
}
