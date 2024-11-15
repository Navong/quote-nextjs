"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useFavoriteStore } from "@/store/useFavoriteStore"
import { RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import type { Quote } from "@/types/quote"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const QuoteCard: React.FC = () => {
  const [translatedText, setTranslatedText] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const { currentQuote, favorites, fetchRandomQuotes, addToFavorites, removeFromFavorites, isLoading } =
    useFavoriteStore()

  const languages = [
    { value: "km", label: "Khmer" },
    { value: "ko", label: "Korean" },
    { value: "ja", label: "Japanese" },
  ]

  useEffect(() => {
    fetchRandomQuotes()
  }, [fetchRandomQuotes])

  useEffect(() => {
    if (currentQuote) {
      const favorited = favorites.some((fav) => fav.quote?.id === currentQuote.id)
      setIsFavorited(favorited)
    }
  }, [currentQuote, favorites])

  const handleTranslate = useCallback(
    async (targetLang: string) => {
      if (!currentQuote) return

      setIsTranslating(true)
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: currentQuote.content,
            targetLanguage: targetLang,
          }),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTranslatedText(data.translatedText)
        setSelectedLanguage(targetLang)
      } catch (error) {
        console.error("Translation failed:", error)
        toast.error("Translation failed")
      } finally {
        setIsTranslating(false)
      }
    },
    [currentQuote],
  )

  const handleNextQuote = useCallback(() => {
    fetchRandomQuotes()
    setTranslatedText("")
    setSelectedLanguage("")
  }, [fetchRandomQuotes])

  const handleToggleFavorite = useCallback(async () => {
    if (!currentQuote) return

    try {
      if (isFavorited) {
        const favoriteToRemove = favorites.find((fav) => fav.quote?.id === currentQuote.id)
        if (favoriteToRemove) {
          await removeFromFavorites(favoriteToRemove.id, favoriteToRemove.quote.id)
          setIsFavorited(false)
          toast.success("Removed from favorites")
        } else {
          throw new Error("Favorite not found")
        }
      } else {
        await addToFavorites(currentQuote, translatedText)
        setIsFavorited(true)
        toast.success("Added to favorites")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update favorites")
    }
  }, [currentQuote, isFavorited, favorites, addToFavorites, removeFromFavorites, translatedText])

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentQuote) {
    return (
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg text-gray-600">No quote available</p>
            <Button onClick={handleNextQuote} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Quote of the Moment</h2>
            <Button variant="ghost" size="icon" onClick={handleNextQuote} className="rounded-lg hover:bg-gray-100">
              <RefreshCcw className="h-5 w-5" />
            </Button>
          </div>

          <div className="pl-4 border-l-4 border-blue-500">
            <blockquote className="text-lg text-gray-700 leading-relaxed">
              "{translatedText || currentQuote.content}"
            </blockquote>
            <p className="mt-2 text-gray-600">- {currentQuote.author}</p>
          </div>

          {currentQuote.tags && (
            <div className="flex flex-wrap gap-2">
              {currentQuote.tags.map((tag) => (
                <span key={tag.id} className="px-3 py-1 text-sm text-gray-600 rounded-full bg-gray-50">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Select value={selectedLanguage} onValueChange={handleTranslate} disabled={isTranslating}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Translate to..." />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleToggleFavorite} variant="default" className="flex-1 bg-gray-900 hover:bg-gray-800">
              {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuoteCard

