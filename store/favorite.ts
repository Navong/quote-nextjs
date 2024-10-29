import { create } from 'zustand';
import { Quote } from '@/type/quote';

interface FavoritesState {
    AdminId: string;
    favorites: Quote[];
    translatedContent: string;
    setTranslatedContent: (translatedContent: string) => void;
    addFavorite: (quote: Quote) => Promise<void>;
    removeFavorite: (quoteId: string) => void;
    toggleFavorite: (quote: Quote) => Promise<void>;
    toggleNextQuote: () => void;
    nextQuoteCount: number;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: [],
    nextQuoteCount: 0,
    translatedContent: '',
    AdminId: `guest_${Math.random().toString(36).substring(2, 10)}`,

    addFavorite: async (quote) => {
        set((state) => {
            const isFavorite = state.favorites.some((fav) => fav.id === quote.id);

            if (!isFavorite) {
                return { favorites: [...state.favorites, quote] };
            }

            return state;
        });
    },

    removeFavorite: async (quoteId) => {
        set((state) => ({
            favorites: state.favorites.filter((q) => q.id !== quoteId),
        }));
    },

    toggleFavorite: async (quote) => {
        const { favorites, addFavorite, removeFavorite } = get();
        const isFavorite = favorites.some((fav) => fav.id === quote.id);

        if (isFavorite) {
            await removeFavorite(quote.id);
        } else {
            await addFavorite(quote);
        }
    },

    toggleNextQuote: () => {
        set((state) => {
            const count = state.nextQuoteCount + 1;
            if (count % 2 === 0) {
                // Refetch API every 3 times
                set({ nextQuoteCount: 0 });
                return {};
            } else {
                return { nextQuoteCount: count };
            }
        });
    },

    setTranslatedContent: (translatedContent: string) => {
        set({ translatedContent });
    },

}));

