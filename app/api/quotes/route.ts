import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch a random quote from the API
    const response = await fetch(`${process.env.API_BASE_URL}/quotes/random`);
    const quote = await response.json();
    
    // Return the quote and cache it for 60 seconds (1 minute)
    return NextResponse.json(quote, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=59', // Cache for 60 seconds
      }
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}
