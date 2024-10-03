'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";


const FavoritesPage = () => {
    // This would normally come from your data source
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading favorites
        const fetchFavorites = async () => {
            setIsLoading(true);
            try {
                // Replace with actual API call
                // const response = await getFavorites();
                const response = await fetch('/api/favorites');
                const data = await response.json();
                setFavorites(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, []);


    console.log('Favorites:', favorites);

    return (
        <main className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex items-center justify-between p-4 rounded-lg bg-card shadow-sm">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary fill-current" />
                        <h1 className="text-lg font-semibold">My Favorites</h1>
                    </div>
                </header>

                <Card className="shadow-md">
                    <CardContent className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-pulse text-muted-foreground">
                                    Loading favorites...
                                </div>
                            </div>
                        ) : favorites.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <Heart className="h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground text-center">
                                    No favorites yet. Start adding quotes you love!
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Discover Quotes
                                </Button>
                            </div>
                        ) : (
                            <ScrollArea className="h-[600px] pr-4">
                                <div className="grid gap-4">
                                    {favorites.map((quote) => (
                                        <Card key={quote.quote.id} className="p-4">
                                            <div className="space-y-2">
                                                <p className="text-lg">{quote.quote.content}</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-muted-foreground">
                                                        - {quote.quote.author}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveFavorite(quote.quote.id)}
                                                        className="text-primary hover:text-primary/90"
                                                    >
                                                        <Heart className="h-4 w-4 fill-current" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default FavoritesPage;