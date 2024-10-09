'use client';

/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { toast } from 'sonner';
import { useFavoritesStore } from "@/store/favorite";
import { Quote } from "@/type/quote";

const FavoritesPage = () => {
    const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isFavoriting, setIsFavoriting] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/favorites');

                if (!response.ok) {
                    throw new Error('Error fetching favorites');
                }

                const data = await response.json();
                data.forEach((quote: { quote: Quote }) => { 
                    addFavorite(quote.quote) 
                });
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                toast.error("Failed to load favorites");
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [addFavorite]);

    const handleRemoveFavorite = async (quote: Quote) => {
        setIsFavoriting(true);
        try {
            await removeFavorite(quote.id);
            const response = await fetch('/api/favorites', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quoteId: quote.id
                }),
            });

            if (!response.ok) {
                throw new Error('Error removing favorite');
            }
            toast.success("Removed from favorites");
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error("Failed to remove favorite");
        } finally {
            setIsFavoriting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 bg-background p-3 sm:p-4 md:p-6 pb-0">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-sm">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <Button
                                    variant="ghost"
                                    className="w-full sm:w-auto flex items-center gap-2 text-sm"
                                    onClick={() => window.history.back()}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 sm:h-5 w-4 sm:w-5 text-primary fill-current" />
                                    <h1 className="text-base sm:text-lg font-semibold">My Favorites</h1>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pt-3">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-md">
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-48 sm:h-64">
                                    <div className="animate-pulse text-sm sm:text-base text-muted-foreground">
                                        Loading favorites...
                                    </div>
                                </div>
                            ) : favorites.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-3 sm:space-y-4 p-4">
                                    <Heart className="h-8 sm:h-12 w-8 sm:w-12 text-muted-foreground" />
                                    <p className="text-sm sm:text-base text-muted-foreground text-center">
                                        No favorites yet. Start adding quotes you love!
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-sm"
                                        onClick={() => window.history.back()}
                                    >
                                        Discover Quotes
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:gap-4">
                                    {favorites.map((quote) => (
                                        <Card 
                                            key={quote.id} 
                                            className="p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                    {quote.tags && quote.tags.length > 0 && (
                                                        quote.tags.map((tag) => (
                                                            <span
                                                                key={tag.id}
                                                                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-gray-100 text-gray-600 rounded-md"
                                                            >
                                                                {tag.name}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                                                    "{quote.content}"
                                                </p>
                                                <div className="flex items-center justify-between pt-1">
                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                        - {quote.author}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveFavorite(quote)}
                                                        className="text-primary hover:text-primary/90 hover:bg-gray-100"
                                                        disabled={isFavoriting}
                                                    >
                                                        <Heart className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-current" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;