"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { QuoteProps } from '@/type/quote'// Compact version of QuoteCard for recommendations
import { Heart, Star } from 'lucide-react'
import { Button } from './ui/button'


const CompactQuoteCard = ({ quote }: { quote: QuoteProps }) => {
  return (
    <Card className="mb-4 last:mb-0">
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium line-clamp-2">
            "{quote.content}"
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              - {quote.author}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
            >
              {quote.isFavorite ? (
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
    const [recommendations, setRecommendations] = useState<QuoteProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRecommendations() {
            try {
                const response = await fetch(`/api/recommendations`)
                const data = await response.json()
                setRecommendations(data)
            } catch (error) {
                console.error('Failed to load recommendations:', error)
            } finally {
                setLoading(false)
            }
        }

        loadRecommendations()
    }, [])


    if (loading) {
        return <div className="text-center text-gray-400">Loading recommendations...</div>
    }

    console.log(recommendations)

    return (
        <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">
          Recommended for You
        </h2>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {recommendations.map((quote) => (
              <CompactQuoteCard
                key={quote.id}
                quote={quote}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
    )
}