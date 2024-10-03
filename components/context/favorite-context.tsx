"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define types for the favorite and context state
interface Favorite {
  id: string;
  content: string;
  author: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (id: string) => void;
  isLoading: boolean;
}

// Create the context with a default value
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider component that will wrap the app
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetching the favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch('/api/favorites');
        const data: Favorite[] = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Add a favorite
  const addFavorite = (favorite: Favorite) => {
    setFavorites(prevFavorites => [...prevFavorites, favorite]);
  };
      

  // Remove a favorite
  const removeFavorite = (id: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the Favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
