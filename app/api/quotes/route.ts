import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/quotes/random`);
    const quotes = await response.json();
    
    // Returning the JSON response with revalidation every 60 seconds
    return NextResponse.json(quotes, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=59', // Caching for 60 seconds, allowing revalidation
      }
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
