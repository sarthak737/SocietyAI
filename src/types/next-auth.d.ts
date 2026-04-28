import "next-auth"

declare module "next-auth" {
  interface User {
    id: number
    role: string
    flat_number?: string | null
    phone?: string | null
  }

  interface Session {
    user: User & {
      id: number
      role: string
      flat_number?: string | null
      phone?: string | null
    }
  }
}
