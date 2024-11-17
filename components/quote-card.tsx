"use client"


/* eslint-disable react/no-unescaped-entities */ 
import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useFavoriteStore } from "@/store/useFavoriteStore"
import { RefreshCcw } from "lucide-react"
import { toast } from "sonner"
// import type { Quote } from "@/types/quote"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const QuoteCard: React.FC = () => {
  const [translatedText, setTranslatedText] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  const { currentQuote, favorites, fetchRandomQuotes, addToFavorites, isLoading } =
    useFavoriteStore()

  const languages = [
    { value: "kh", label: "Khmer" },
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
    setIsFavorited(false)
  }, [fetchRandomQuotes])

  const handleToggleFavorite = useCallback(async () => {
    if (!currentQuote || isFavorited) return

    setIsAddingToFavorites(true)
    try {
      await addToFavorites(currentQuote, translatedText)
      setIsFavorited(true)
      toast.success("Added to favorites")
    } catch (error) {
      console.error("Error adding to favorites:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add to favorites")
    } finally {
      setIsAddingToFavorites(false)
    }
  }, [currentQuote, isFavorited, addToFavorites, translatedText])

  if (isLoading) {
    return (
      <Card className="bg-background shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentQuote) {
    return (
      <Card className="bg-background shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg text-foreground">No quote available</p>
            <Button onClick={handleNextQuote} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Quote of the Moment</h2>
            <Button variant="ghost" size="icon" onClick={handleNextQuote} className="rounded-lg hover:bg-muted">
              <RefreshCcw className="h-5 w-5" />
            </Button>
          </div>

          <div className="pl-4 border-l-4 border-primary">
            <blockquote className="text-lg text-foreground leading-relaxed">
              "{translatedText || currentQuote.content}"
            </blockquote>
            <p className="mt-2 text-muted-foreground">- {currentQuote.author}</p>
          </div>

          {currentQuote.tags && (
            <div className="flex flex-wrap gap-2">
              {currentQuote.tags.map((tag) => (
                <span key={tag.id} className="px-3 py-1 text-sm text-muted-foreground rounded-full bg-secondary">
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
            <Button
              onClick={handleToggleFavorite}
              variant={isFavorited ? "secondary" : "default"}
              className="flex-1"
              disabled={isFavorited || isAddingToFavorites}
            >
              {isFavorited ? "Added" : isAddingToFavorites ? "Adding..." : "Add to Favorites"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuoteCard

