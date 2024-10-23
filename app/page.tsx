import QuoteCard from "@/components/quote-card";
import { RecommendationSection } from "@/components/recommendation-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="bg-background min-h-screen">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="p-4 space-y-4">
          <div className="flex justify-start">
            <Link href="/favorites">
              <Button variant="outline" className="flex items-center gap-1.5 text-sm" >
                <Star className="h-3.5 w-3.5" />
                Favorites
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <Card className="shadow-md">
              <CardContent className="p-4">
                <QuoteCard />
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-4">
                <RecommendationSection />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <div className="flex justify-start">
            <Link href="/favorites">
              <Button variant="outline" className="flex items-center gap-2" >
                <Star className="h-4 w-4" />
                Favorites
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <QuoteCard />
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <RecommendationSection />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}