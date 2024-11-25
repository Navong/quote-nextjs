"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Home } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Badge } from "./ui/badge"
import { useFavoriteStore } from "@/store/useFavoriteStore"

export default function Header() {
  const { favorites } = useFavoriteStore()
  const pathname = usePathname()
  const isOnFavoritesPage = pathname === "/favorites"

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Quote App
        </Link>
        <div className="flex items-center space-x-4">
          <Link href={isOnFavoritesPage ? "/" : "/favorites"} passHref>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 relative min-w-[120px] justify-center">
              {isOnFavoritesPage ? (
                <>
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">Favorites</span>
                  {favorites.length > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                      {favorites.length}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

