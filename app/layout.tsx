import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quote App",
  description: "Discover and save your favorite quotes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Toaster />
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  )
}

