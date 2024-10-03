import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = "http://localhost:3333/api";



export async function getQuoteOfTheDay() {
    const response = await fetch(`${API_BASE_URL}/quotes/all`)
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


export async function getFavorites() {
    
}