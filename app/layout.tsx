// app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs"
import Header from "@/components/header"
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
          <SignedIn>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 max-w-7xl mx-auto w-full">
                {children}
                <Toaster />
              </main>
              {/* <Footer /> */}
            </div>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  )
}

