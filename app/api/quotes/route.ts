import { NextResponse } from "next/server"
import type { Quote } from "@/types/quote"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

let cachedQuotes: Quote[] = []
let lastFetchTime = 0
const CACHE_DURATION = 60 * 1000 // 60 seconds in milliseconds
const QUOTES_POOL_SIZE = 50 // Number of quotes to keep in the pool

export async function GET() {
  const now = Date.now()

  try {
    // Refresh the cache if it's empty or expired
    if (cachedQuotes.length === 0 || now - lastFetchTime > CACHE_DURATION) {
      const response = await fetch(`${API_BASE_URL}/quotes/random?count=${QUOTES_POOL_SIZE}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      cachedQuotes = await response.json()
      lastFetchTime = now
    }

    // Select a random quote from the cached pool
    const randomIndex = Math.floor(Math.random() * cachedQuotes.length)
    const randomQuote = cachedQuotes[randomIndex]

    // Remove the selected quote from the pool to avoid immediate repetition
    cachedQuotes.splice(randomIndex, 1)

    return NextResponse.json([randomQuote], {
      headers: {
        "Cache-Control": "no-store", // Prevent caching of the random selection
      },
    })
  } catch (error) {
    console.error("Error fetching random quote:", error)
    return NextResponse.json({ error: "Failed to fetch random quote" }, { status: 500 })
  }
}

