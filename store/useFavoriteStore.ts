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
      set({ favorites, isLoading: false })
    } catch (error) {
      console.error("Error fetching favorites:", error)
      set({ isLoading: false, favorites: [] })
    }
  },

  addToFavorites: async (quote: Quote, translatedText?: string) => {
    const { userId } = get()
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
      set((state) => ({
        favorites: [...state.favorites, newFavorite],
        currentQuote: state.currentQuote, // Force re-render of components using currentQuote
      }))
    } catch (error) {
      console.error("Error adding to favorites:", error)
      throw error
    }
  },

  removeFromFavorites: async (favoriteId: string, quoteId: string) => {
    const { userId } = get()
    try {
      const response = await fetch(`/api/favorites/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteId, quoteId }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      set((state) => ({
        favorites: state.favorites.filter((fav) => fav.id !== favoriteId),
        currentQuote: state.currentQuote, // Force re-render of components using currentQuote
      }))
    } catch (error) {
      console.error("Error removing from favorites:", error)
      throw error
    }
  },

  setCurrentQuote: (quote: Quote) => set({ currentQuote: quote }),
}))

