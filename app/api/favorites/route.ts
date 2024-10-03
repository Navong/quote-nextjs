import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


const API_BASE_URL = "http://localhost:3333/api";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Step 1: Authenticate user and extract userId
    const { userId } = await auth(); // From Clerk middleware or auth helper

    if (!userId) {
      return NextResponse.json(
        JSON.stringify({ error: "Unauthorized access" }),
        { status: 401 }
      );
    }


    // Step 2: Parse the incoming request body for quoteId
    const { quoteId } = req.method === "POST" ? await req.json() : {};
    if (!quoteId) {
      return NextResponse.json(
        JSON.stringify({ error: "QuoteId is required" }),
        { status: 400 }
      );
    }

    // Step 3: Prepare payload to send to external API
    const payload = {
      userId,
      quoteId,
    };

    // Step 4: Send data to external API
    const externalResponse = await fetch("http://localhost:3333/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle response from the external API
    if (!externalResponse.ok) {
      const errorDetails = await externalResponse.json();
      return NextResponse.json(
        JSON.stringify({ error: "Failed to add favorite", details: errorDetails }),
        { status: 500 }
      );
    }

    // Step 5: Return success response
    return NextResponse.json(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      JSON.stringify({ error: "Unexpected error occurred" }),
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest, res: NextResponse) {
  const { userId } = await auth();
  const response = await fetch(`${API_BASE_URL}/favorites/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch favorites')
  }
  const favorites = await response.json();
  return NextResponse.json(
    favorites,
    { status: 200 }
  );
}