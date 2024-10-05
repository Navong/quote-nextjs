"use client"

import { useFavoritesStore } from "@/store/favorite"
import { useState, useCallback, useEffect } from "react"
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
import { getQuoteOfTheDay } from "@/lib/quote"
import { Quote } from "@/type/quote"


const QuoteCard = () => {
    const [currentQuote, setCurrentQuote] = useState<Quote>()
    const [translatedText, setTranslatedText] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [isTranslating, setIsTranslating] = useState(false)
    const [isFavoriting, setIsFavoriting] = useState(false)
    // const { favorites, addFavorite, removeFavorite } = useFavorites()
    const { favorites, addFavorite, removeFavorite, toggleNextQuote, nextQuoteCount } = useFavoritesStore()

    const [quote, setQuote] = useState<Quote | null>(null);

    useEffect(() => {
        (async () => {
            const quote = await getQuoteOfTheDay();
            setCurrentQuote(quote);
        })();
    }, []);

    const isFavorited = currentQuote ? favorites.some(fav => fav.id === currentQuote.id) : false


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

    // Refetch a new quote
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
    }, [])




    // Toggle the favorite state for the current quote
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

                const data = await response.json();
                console.log(data)
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
                        translatedText : translatedText
                    }),
                })

                if (!response.ok) {
                    throw new Error('Error fetching favorites');
                }

                const data = await response.json();
                console.log(data)
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
                <div className="flex items-center space-x-1">
                    <p className="text-sm text-muted-foreground">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {currentQuote?.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-md"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="space-y-6 pt-10">
                    <p className="text-lg text-card-foreground">
                        {translatedText ? translatedText : currentQuote?.content}
                    </p>
                    {translatedText && (
                        <p className="text-sm text-muted-foreground italic">
                            Original: {currentQuote?.content}
                        </p>
                    )}
                    <p className="text-sm font-medium">
                        - {currentQuote?.author}
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
                                setTranslatedText("")
                                setSelectedLanguage("")
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
                    variant={isFavorited ? "secondary" : "default"}
                    className="flex-1"
                    onClick={toggleFavorite}
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
