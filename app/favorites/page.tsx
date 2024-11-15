"use client"

import React, { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { useFavoriteStore } from "@/store/useFavoriteStore"
import Link from "next/link"
import { toast } from "sonner"

const getLanguageName = (code: string) => {
  const languages = {
    km: "Khmer",
    ko: "Korean",
    ja: "Japanese",
  }
  return languages[code as keyof typeof languages] || code
}

export default function FavoritesPage() {
  const { favorites, isLoading, fetchFavorites, removeFromFavorites } = useFavoriteStore()

  useEffect(() => {
    fetchFavorites().catch((error) => {
      console.error("Failed to fetch favorites:", error)
      toast.error("Failed to load favorites")
    })
  }, [fetchFavorites])

  const handleRemoveFavorite = async (favoriteId: string, quoteId: string) => {
    try {
      await removeFromFavorites(favoriteId, quoteId)
      toast.success("Quote removed from favorites")
    } catch (error) {
      console.error("Failed to remove favorite:", error)
      toast.error("Failed to remove quote from favorites")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">You haven't added any favorites yet.</p>
            <Link href="/" passHref>
              <Button>Discover Quotes</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="pl-4 border-l-4 border-blue-500">
                    <blockquote className="text-lg text-gray-700 leading-relaxed">
                      "{favorite.translatedContent || favorite.quote?.content || "Quote content unavailable"}"
                    </blockquote>
                    <p className="mt-2 text-gray-600">- {favorite.quote?.author || "Unknown author"}</p>
                  </div>
                  {favorite.translatedContent && favorite.quote?.content && (
                    <p className="text-sm text-gray-500">Original: "{favorite.quote.content}"</p>
                  )}
                  {/* {favorite.translatedContent && (
                    <p className="text-sm text-blue-600">
                      Translated to: {getLanguageName(favorite.translatedLanguage)}
                    </p>
                  )} */}
                  {favorite.quote?.tags && (
                    <div className="flex flex-wrap gap-2">
                      {favorite.quote.tags.map((tag) => (
                        <span key={tag.id} className="px-3 py-1 text-sm text-gray-600 rounded-full bg-gray-50">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFavorite(favorite.id, favorite.quote?.id || "")}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Remove from Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

