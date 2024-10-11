import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const API_BASE_URL = process.env.API_BASE_URL


export async function GET() {
  const { userId } = await auth();
  const response = await fetch(`${API_BASE_URL}/recommendations/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch Recommendations')
  }
  const recommendations = await response.json();
  return NextResponse.json(
    recommendations,
    { status: 200 }
  );
}