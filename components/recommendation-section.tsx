"use client";

/* eslint-disable react/no-unescaped-entities */
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
    <Card className="mb-4 last:mb-0 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground shrink-0">Tags:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {quote.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-gray-100 text-gray-600 rounded-md"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm sm:text-base font-medium line-clamp-2 leading-relaxed">
            &quot;{quote.content}&quot;
          </p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs sm:text-sm text-muted-foreground">- {quote.author}</p>
            <Button 
              size="sm"
              variant={isFavorited ? "secondary" : "ghost"}
              onClick={toggleFavorite}
              disabled={isFavoriting}
              className="hover:bg-gray-100"
            >
              {isFavorited ? (
                <Heart className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-current text-primary" />
              ) : (
                <Star className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
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
    return (
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4 sm:mb-6">
          Recommended for You
        </h2>
        <p className="mt-[15vh] sm:mt-[20vh] text-center text-xs sm:text-sm text-muted-foreground">
          Nothing to recommend yet
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-[15vh] sm:mt-[20vh]">
        <div className="h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-2xl mx-auto">
      <div className="p-0 sm:p-0">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4 sm:mb-6">
          Recommended for You
        </h2>
        <ScrollArea className="h-[350px] sm:h-[400px] pr-2 sm:pr-4">
          <div className="space-y-3 sm:space-y-4">
            {recommendations.map((quote) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CompactQuoteCard quote={quote} />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
