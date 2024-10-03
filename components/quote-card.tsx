"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart, Languages } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useFavorites } from "./context/favorite-context"

interface Quote {
    id: string
    content: string
    author: string
    createdAt: Date
    updatedAt: Date
    isFavorite?: boolean
}

interface QuoteCardProps {
    quote: Quote[]
    onFavorite?: (quoteId: string) => Promise<void>
    onNextQuote?: () => void
    userId?: string
}

const QuoteCard = ({ quote, onFavorite, onNextQuote, userId }: QuoteCardProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [translatedText, setTranslatedText] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [isTranslating, setIsTranslating] = useState(false)
    const [isFavoriting, setIsFavoriting] = useState(false)
    const { favorites, addFavorite, removeFavorite, isLoading, isFavorite } = useFavorites()

    const currentQuote = quote[currentIndex]

    // Handle translation logic
    const handleTranslate = useCallback(async (targetLang: string) => {
        setIsTranslating(true)
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: currentQuote.content,
                    targetLanguage: targetLang
                }),
            })

            if (!response.ok) {
                throw new Error('Translation failed')
            }

            const data = await response.json()
            setTranslatedText(data.translatedText)
            setSelectedLanguage(targetLang)
            toast.success("Translation successful")

        } catch (error) {
            console.error('Translation failed:', error)
            toast.error("Translation failed")
        } finally {
            setIsTranslating(false)
        }
    }, [currentQuote])

    // Handle next quote
    const handleNextQuote = useCallback(() => {
        if (currentIndex < quote.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setTranslatedText("")
            setSelectedLanguage("")
            onNextQuote?.()
        } else {
            toast.error("No more quotes available")
        }
    }, [currentIndex, quote.length, onNextQuote])

    // Toggle the favorite state for the current quote
    const toggleFavorite = async () => {
        // Check if the quote is already in the favorites
        const isFavorited = favorites.some(fav => fav.id === currentQuote.id)

        setIsFavoriting(true)
        try {
            if (isFavorited) {
                await removeFavorite(currentQuote.id)  // Remove from favorites
                toast.success("Removed from favorites")
            } else {
                await addFavorite(currentQuote)  // Add to favorites
                toast.success("Added to favorites")
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error)
            toast.error("Failed to toggle favorite")
        } finally {
            setIsFavoriting(false)
        }
    }

    const languages = [
        { value: "es", label: "Spanish" },
        { value: "ko", label: "Korean" },
        { value: "ja", label: "Japanese" },
        { value: "ru", label: "Russian" },
        { value: "fr", label: "French" },
        { value: "kh", label: "Khmer" },
    ]

    return (
        <Card className="h-full min-h-[500px]">
            <CardContent className="pt-6 space-y-6 min-h-[400px]">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Quote of the Moment
                </h2>
                <div className="space-y-6 pt-10">
                    <p className="text-lg text-card-foreground">
                        {translatedText ? translatedText : currentQuote.content}
                    </p>
                    {translatedText && (
                        <p className="text-sm text-muted-foreground italic">
                            Original: {currentQuote.content}
                        </p>
                    )}
                    <p className="text-sm font-medium">
                        - {currentQuote.author}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={selectedLanguage}
                        onValueChange={handleTranslate}
                        disabled={isTranslating}
                    >
                        <SelectTrigger className="w-[180px]">
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

                    {selectedLanguage && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                setTranslatedText("");
                                setSelectedLanguage("");
                            }}
                            disabled={isTranslating}
                            className="h-10 w-10"
                        >
                            <Languages className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {isTranslating && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Translating...
                    </p>
                )}
            </CardContent>

            <CardFooter className="pt-6 flex justify-between gap-4">
                <Button
                    variant={favorites.some(fav => fav.id === currentQuote.id) ? "secondary" : "default"}
                    className="flex-1"
                    onClick={toggleFavorite}
                    disabled={isFavoriting}
                >
                    {favorites.some(fav => fav.id === currentQuote.id) ? (
                        <Heart className="mr-2 h-4 w-4 fill-current" />
                    ) : (
                        <Star className="mr-2 h-4 w-4" />
                    )}
                    {favorites.some(fav => fav.id === currentQuote.id) ? "FAVORITED" : "FAVORITE"}
                </Button>
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleNextQuote}
                >
                    NEXT QUOTE
                </Button>
            </CardFooter>
        </Card>
    )
}

export default QuoteCard
