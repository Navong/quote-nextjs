import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "./ui/button"

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto max-w-3xl px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Quote App
          </Link>
          <Link href="/favorites" passHref>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span>Favorites</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

