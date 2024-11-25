import QuoteCard from "@/components/quote-card"
import { RecommendationSection } from "@/components/recommendation-section"

export default function Home() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <QuoteCard />
        <RecommendationSection />
      </div>
    </div>
  )
}

