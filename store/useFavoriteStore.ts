import { create } from "zustand"
import type { Quote, FavoriteQuote } from "@/types/quote"

interface FavoriteStore {
  favorites: FavoriteQuote[]
  currentQuote: Quote | null
  isLoading: boolean
  userId: string
  fetchRandomQuotes: () => Promise<void>
  fetchFavorites: () => Promise<void>
  addToFavorites: (quote: Quote, translatedText?: string) => Promise<void>
  removeFromFavorites: (favoriteId: string, quoteId: string) => Promise<void>
  setCurrentQuote: (quote: Quote) => void
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  currentQuote: null,
  isLoading: false,
  userId: "user123", // This should be set to the actual user ID in a real application

  fetchRandomQuotes: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/quotes")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const quotes: Quote[] = await response.json()
      set({ currentQuote: quotes[0] || null, isLoading: false })
    } catch (error) {
      console.error("Error fetching random quotes:", error)
      set({ isLoading: false, currentQuote: null })
    }
  },

  fetchFavorites: async () => {
    const { userId } = get()
    set({ isLoading: true })
    try {
      const response = await fetch(`/api/favorites/${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const favorites: FavoriteQuote[] = await response.json()
      // Sort favorites by createdAt date, most recent first
      const sortedFavorites = favorites.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      set({ favorites: sortedFavorites, isLoading: false })
    } catch (error) {
      console.error("Error fetching favorites:", error)
      set({ isLoading: false, favorites: [] })
    }
  },

  addToFavorites: async (quote: Quote, translatedText?: string) => {
    const { userId, favorites } = get()
    const now = new Date().toISOString()
    // Optimistically update the state
    const optimisticFavorite: FavoriteQuote = {
      id: Date.now().toString(), // Temporary ID
      userId,
      quoteId: quote.id,
      createdAt: now,
      translatedContent: translatedText,
      quote,
    }
    set({ favorites: [optimisticFavorite, ...favorites] })

    try {
      const response = await fetch(`/api/favorites/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id, translatedContent: translatedText }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const newFavorite: FavoriteQuote = await response.json()
      // Update with the actual data from the server
      set((state) => ({
        favorites: state.favorites.map((fav) =>
          fav.id === optimisticFavorite.id ? { ...newFavorite, createdAt: now } : fav,
        ),
      }))
    } catch (error) {
      // Revert the optimistic update on error
      set((state) => ({
        favorites: state.favorites.filter((fav) => fav.id !== optimisticFavorite.id),
      }))
      console.error("Error adding to favorites:", error)
      throw error
    }
  },

  removeFromFavorites: async (favoriteId: string, quoteId: string) => {
    const { userId, favorites } = get()
    // Optimistically update the state
    set({ favorites: favorites.filter((fav) => fav.id !== favoriteId) })

    try {
      const response = await fetch(`/api/favorites/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteId, quoteId }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      // Revert the optimistic update on error
      set({ favorites })
      console.error("Error removing from favorites:", error)
      throw error
    }
  },

  setCurrentQuote: (quote: Quote) => set({ currentQuote: quote }),
}))

