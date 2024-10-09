"use client"

import { useFavoritesStore } from "@/store/favorite"
import { useState, useCallback, useEffect } from "react"
import { CardFooter } from "@/components/ui/card"
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
import { getQuoteOfTheDay } from "@/lib/quote"
import { Quote } from "@/type/quote"

const QuoteCard = () => {
    const [currentQuote, setCurrentQuote] = useState<Quote>()
    const [translatedText, setTranslatedText] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [isTranslating, setIsTranslating] = useState(false)
    const [isFavoriting, setIsFavoriting] = useState(false)
    const { favorites, addFavorite, removeFavorite, toggleNextQuote } = useFavoritesStore()

    useEffect(() => {
        (async () => {
            const quote = await getQuoteOfTheDay();
            setCurrentQuote(quote);
        })();
    }, []);

    const isFavorited = currentQuote ? favorites.some(fav => fav.id === currentQuote.id) : false

    const handleTranslate = useCallback(async (targetLang: string) => {
        setIsTranslating(true)
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: currentQuote?.content || "",
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

    const handleNextQuote = useCallback(async () => {
        try {
            const response = await getQuoteOfTheDay()
            setCurrentQuote(response)
            setTranslatedText("")
            setSelectedLanguage("")
            toggleNextQuote()
            toast.success("Loaded next quote")
        } catch (error) {
            console.error('Failed to load new quote:', error)
            toast.error("Failed to load new quote")
        }
    }, [toggleNextQuote])

    const toggleFavorite = async () => {
        if (!currentQuote) return;
        const isFavorited = favorites.some(fav => fav.id === currentQuote.id)

        setIsFavoriting(true)
        try {
            if (isFavorited) {
                await removeFavorite(currentQuote.id)
                const response = await fetch('/api/favorites', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quoteId: currentQuote.id
                    }),
                })

                if (!response.ok) {
                    throw new Error('Error fetching favorites');
                }

                toast.success("Removed from favorites")
            } else {
                await addFavorite(currentQuote)

                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quoteId: currentQuote.id,
                        translatedText: translatedText
                    }),
                })

                if (!response.ok) {
                    throw new Error('Error fetching favorites');
                }

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
        <div className="w-full max-w-2xl mx-auto h-full">
            <div className="p-0 sm:p-0 space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    Quote of the Moment
                </h2>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <p className="text-sm text-muted-foreground">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {currentQuote?.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-xs sm:text-sm bg-gray-100 text-gray-600 rounded-md"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                    <p className="text-base sm:text-lg text-card-foreground leading-relaxed">
                        {translatedText ? translatedText : currentQuote?.content}
                    </p>
                    {translatedText && (
                        <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                            Original: {currentQuote?.content}
                        </p>
                    )}
                    <p className="text-sm font-medium pt-2">
                        - {currentQuote?.author}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-full sm:w-auto flex items-center gap-2">
                        <Select
                            value={selectedLanguage}
                            onValueChange={handleTranslate}
                            disabled={isTranslating}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
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
                                    setTranslatedText("")
                                    setSelectedLanguage("")
                                }}
                                disabled={isTranslating}
                                className="h-10 w-10 flex-shrink-0"
                            >
                                <Languages className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {isTranslating && (
                        <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
                            Translating...
                        </p>
                    )}
                </div>
            </div>

            <CardFooter className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                    variant={isFavorited ? "secondary" : "default"}
                    className="w-full sm:flex-1"
                    onClick={toggleFavorite}
                    disabled={isFavoriting}
                >
                    {isFavorited ? (
                        <Heart className="mr-2 h-4 w-4 fill-current" />
                    ) : (
                        <Star className="mr-2 h-4 w-4" />
                    )}
                    {isFavorited ? "FAVORITED" : "FAVORITE"}
                </Button>
                <Button
                    variant="outline"
                    className="w-full sm:flex-1"
                    onClick={handleNextQuote}
                >
                    NEXT QUOTE
                </Button>
            </CardFooter>
        </div>
    )
}

export default QuoteCard