
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



export async function getQuoteOfTheDay() {
    const response = await fetch(`${API_BASE_URL}/quotes/random`)
    if (!response.ok) {
        throw new Error('Failed to fetch quote')
    }
    return response.json()
}

export async function getPopularQuotes() {
    const response = await fetch(`${API_BASE_URL}/popular`)
    if (!response.ok) {
        throw new Error('Failed to fetch popular quotes')
    }
    return response.json()
}
