'use client';

import React, { useState, useCallback, useEffect } from "react";
import { useFavoritesStore } from "@/store/favorite";
import { Star, Heart, Languages } from "lucide-react";
import { toast } from "sonner";
import { Quote } from "@/type/quote";

const QuoteCard = () => {
    const [currentQuote, setCurrentQuote] = useState<Quote>({} as Quote);
    const [translatedText, setTranslatedText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { favorites, addFavorite, removeFavorite, toggleNextQuote, AdminId } = useFavoritesStore();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const response = await fetch('/api/quotes');
                if (!response.ok) throw new Error('Failed to fetch quotes');
                const data = await response.json();
                setQuotes(data);
                setCurrentIndex(0);
                setCurrentQuote(data[currentIndex]);
                toast.success("Initially fetched quote");
            } catch (error) {
                console.log(currentIndex);
                console.error('Error fetching quotes:', error);
            }
        };
        fetchQuotes();
    }, []);

    const isFavorited = currentQuote ? favorites.some(fav => fav.id === currentQuote.id) : false;

    const handleTranslate = useCallback(async (targetLang: string) => {
        setIsTranslating(true);
        setIsDropdownOpen(false);
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: currentQuote?.content || "",
                    targetLanguage: targetLang
                }),
            });
            if (!response.ok) throw new Error('Translation failed');
            const data = await response.json();
            setTranslatedText(data.translatedText);
            setSelectedLanguage(targetLang);
            toast.success("Translation successful");
        } catch (error) {
            console.error('Translation failed:', error);
            toast.error("Translation failed");
        } finally {
            setIsTranslating(false);
        }
    }, [currentQuote]);

    const handleNextQuote = useCallback(() => {
        if (quotes.length > 0) {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % quotes.length;
                setCurrentQuote(quotes[nextIndex]);
                return nextIndex;
            });
            setTranslatedText("");
            setSelectedLanguage("");
            toggleNextQuote();
        } else {
            console.error("Quotes not loaded yet");
            toast.error("No quotes available");
        }
    }, [quotes, toggleNextQuote]);

    const toggleFavorite = async () => {
        if (!currentQuote) return;
        setIsFavoriting(true);
        try {
            if (isFavorited) {
                await removeFavorite(currentQuote.id);
                const response = await fetch(`/api/favorites/${AdminId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quoteId: currentQuote.id }),
                });
                if (!response.ok) throw new Error('Error fetching favorites');
                toast.success("Removed from favorites");
            } else {
                await addFavorite(currentQuote);
                const response = await fetch(`/api/favorites/${AdminId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quoteId: currentQuote.id,
                        translatedText: translatedText,
                    }),
                });
                if (!response.ok) throw new Error('Error fetching favorites');
                toast.success("Added to favorites");
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            toast.error("Failed to toggle favorite");
        } finally {
            setIsFavoriting(false);
        }
    };

    const languages = [
        { value: "es", label: "Spanish" },
        { value: "ko", label: "Korean" },
        { value: "ja", label: "Japanese" },
        { value: "ru", label: "Russian" },
        { value: "fr", label: "French" },
        { value: "kh", label: "Khmer" },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg">
            {/* Mobile Version */}
            <div className="block md:hidden min-h-[400px] p-4">
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                    Quote of the Moment
                </h2>

                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-600">Tags:</p>
                        <div className="flex flex-wrap gap-2">
                            {currentQuote?.tags?.map((tag, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-base text-gray-800 leading-relaxed">
                            {translatedText || currentQuote?.content}
                        </p>
                        {translatedText && (
                            <p className="text-xs text-gray-600 italic leading-relaxed">
                                Original: {currentQuote?.content}
                            </p>
                        )}
                        <p className="text-sm font-medium">
                            - {currentQuote?.author}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-2 text-left bg-white border rounded-lg flex justify-between items-center"
                                disabled={isTranslating}
                            >
                                <span className="text-sm text-gray-700">
                                    {selectedLanguage ? languages.find(l => l.value === selectedLanguage)?.label : "Translate to..."}
                                </span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.value}
                                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                                            onClick={() => handleTranslate(lang.value)}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedLanguage && (
                            <button
                                onClick={() => {
                                    setTranslatedText("");
                                    setSelectedLanguage("");
                                }}
                                disabled={isTranslating}
                                className="w-full p-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center"
                            >
                                <Languages className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={toggleFavorite}
                        disabled={isFavoriting}
                        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                            isFavorited ? "bg-gray-100 hover:bg-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {isFavorited ? (
                            <Heart className="h-4 w-4 fill-current" />
                        ) : (
                            <Star className="h-4 w-4" />
                        )}
                        {isFavorited ? "FAVORITED" : "FAVORITE"}
                    </button>
                    <button
                        onClick={handleNextQuote}
                        className="w-full py-2 px-4 border rounded-lg hover:bg-gray-50"
                    >
                        NEXT QUOTE
                    </button>
                </div>
            </div>

            {/* Desktop Version */}
            <div className="hidden md:block min-h-[500px]">
                <div className="p-6 space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Quote of the Moment
                    </h2>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Tags:</p>
                        <div className="flex flex-wrap gap-2">
                            {currentQuote?.tags?.map((tag, index) => (
                                <span key={index} className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-md">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 py-6">
                        <p className="text-lg text-gray-800 leading-relaxed">
                            {translatedText || currentQuote?.content}
                        </p>
                        {translatedText && (
                            <p className="text-sm text-gray-600 italic leading-relaxed">
                                Original: {currentQuote?.content}
                            </p>
                        )}
                        <p className="text-sm font-medium">
                            - {currentQuote?.author}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-[180px]">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-2 text-left bg-white border rounded-lg flex justify-between items-center"
                                disabled={isTranslating}
                            >
                                <span className="text-sm text-gray-700">
                                    {selectedLanguage ? languages.find(l => l.value === selectedLanguage)?.label : "Translate to..."}
                                </span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.value}
                                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                                            onClick={() => handleTranslate(lang.value)}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedLanguage && (
                            <button
                                onClick={() => {
                                    setTranslatedText("");
                                    setSelectedLanguage("");
                                }}
                                disabled={isTranslating}
                                className="p-2 border rounded-lg hover:bg-gray-50"
                            >
                                <Languages className="h-4 w-4" />
                            </button>
                        )}

                        {isTranslating && (
                            <p className="text-sm text-gray-600 animate-pulse">
                                Translating...
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t flex gap-4">
                    <button
                        onClick={toggleFavorite}
                        disabled={isFavoriting}
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                            isFavorited ? "bg-gray-100 hover:bg-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {isFavorited ? (
                            <Heart className="h-4 w-4 fill-current" />
                        ) : (
                            <Star className="h-4 w-4" />
                        )}
                        {isFavorited ? "FAVORITED" : "FAVORITE"}
                    </button>
                    <button
                        onClick={handleNextQuote}
                        className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
                    >
                        NEXT QUOTE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteCard;