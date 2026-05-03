import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    flat_number?: string | null
    phone?: string | null
  }

  interface Session {
    user: User & {
      id: string
      role: string
      flat_number?: string | null
      phone?: string | null
    }
  }
}
