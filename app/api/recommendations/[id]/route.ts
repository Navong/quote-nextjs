import { NextRequest, NextResponse } from "next/server";


const API_BASE_URL = process.env.API_BASE_URL


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id

    const response = await fetch(`${API_BASE_URL}/recommendations/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch Recommendations')
    }
    const recommendations = await response.json();
    console.log(recommendations)
    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error('Error fetching Recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch Recommendations' }, { status: 500 });
  }

}