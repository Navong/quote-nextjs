// app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Header from "@/components/header"
import FavoritesPage from "@/components/favorite"
import { FavoritesProvider } from "@/components/context/favorite-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Daily Quotes App",
  description: "Get inspired with daily quotes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <FavoritesProvider>
            <Header />
            <main>{children}</main>
            <Toaster />
          </FavoritesProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}