"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Quote } from "@/type/quote";
import { useFavoritesStore } from "@/store/favorite";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CompactQuoteCard = ({ quote }: { quote: Quote }) => {
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const isFavorited = favorites.some(fav => fav.id === quote.id)
  const [isFavoriting, setIsFavoriting] = useState(false);


  const toggleFavorite = async () => {
    if (!quote) return;
    const isFavorited = favorites.some(fav => fav.id === quote.id)

    setIsFavoriting(true)
    try {
      if (isFavorited) {
        await removeFavorite(quote.id)
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quoteId: quote.id
          }),
        })

        if (!response.ok) {
          throw new Error('Error fetching favorites');
        }

        const data = await response.json();
        console.log(data)
        toast.success("Removed from favorites")
      } else {
        await addFavorite(quote)

        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quoteId: quote.id
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

  return (
    <Card className="mb-4 last:mb-0">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <p className="text-sm text-muted-foreground">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {quote.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-md"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm font-medium line-clamp-2">
            "{quote.content}"
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">- {quote.author}</p>
            <Button size="sm"
              variant={isFavorited ? "secondary" : "ghost"}
              // className="flex-1"
              onClick={toggleFavorite}
            >
              {isFavorited ? (
                <Heart className="h-4 w-4 fill-current text-primary" />
              ) : (
                <Star className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const { nextQuoteCount } = useFavoritesStore();

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      try {
        const response = await fetch(`/api/recommendations`);
        const data = await response.json();
        if (data === null) {
          setRecommendations([]);
        } else {
          setRecommendations(data);
        }
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    if (nextQuoteCount % 3 === 0) {
      loadRecommendations();
    }
  }, [nextQuoteCount]);

  if (recommendations.length === 0) {
    return <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-6">
        Recommended for You
      </h2>
      <p className="mt-[20vh] text-center text-sm text-muted-foreground">Nothing to recommend yet</p>
    </div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-[20vh]">
        <div className="h-5 w-5 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">
          Recommended for You
        </h2>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {recommendations.map((quote) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <CompactQuoteCard quote={quote} />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


