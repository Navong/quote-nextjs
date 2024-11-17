'use client'

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Badge } from "./ui/badge"
import { useFavoriteStore } from "@/store/useFavoriteStore"

export default function Header() {
  const { favorites } = useFavoriteStore()

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto max-w-3xl px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Quote App
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/favorites" passHref>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 relative">
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
                {favorites.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

