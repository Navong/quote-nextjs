// app/page.tsx

import Header from "@/components/header"
import QuoteCard from "@/components/quote-card"
import { RecommendationSection } from "@/components/recommendation-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getQuoteOfTheDay } from "@/lib/quote"
import { Star } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const quote = await getQuoteOfTheDay()




  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* <Header /> */}

        <div className="flex justify-start">
          <Link href="/favorites">
            <Button variant="outline" className="flex items-center gap-2" >
              <Star className="h-4 w-4" />
              Favorites
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <QuoteCard quote={quote} />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <RecommendationSection />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}