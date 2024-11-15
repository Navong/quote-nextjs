export interface Tag {
  id: string
  name: string
}

export interface Quote {
  id: string
  content: string
  author: string
  tags?: Tag[]
}

export interface FavoriteQuote {
  id: string
  userId: string
  quoteId: string
  createdAt: string
  translatedContent?: string
  quote: Quote
}

