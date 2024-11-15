import QuoteCard from "@/components/quote-card"
import { RecommendationSection } from "@/components/recommendation-section"

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-6">
        <QuoteCard />
        <RecommendationSection />
      </div>
    </div>
  )
}

