import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/quotes/random`);
    const quotes = await response.json();
    console.log('Quotes:', quotes);
    return NextResponse.json(quotes, { status: 200 });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
