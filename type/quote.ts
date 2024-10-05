export interface Quote {
  id: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
  quote : QuoteContent
  isFavorite?: boolean
  tags: { id: string; name: string }[]
}

export interface QuoteContent {
  id: string
  content: string
  author: string
  translatedContent: string
  createdAt: Date
  updatedAt: Date
  isFavorite?: boolean
  tags: { id: string; name: string }[]
}