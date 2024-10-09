import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


const API_BASE_URL = "http://localhost:3333/api";

export async function POST(req: NextRequest) {
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
    const { quoteId, translatedText } = req.method === "POST" ? await req.json() : {};
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
      translatedText
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


export async function GET() {
  try {
    // Get the userId from the auth function
    const { userId } = await auth();
    
    if (!userId) {
      // Return error response if userId is not found
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    // Construct the API URL
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);

    if (!response.ok) {
      // Error handling if the response is not ok
      throw new Error('Failed to fetch favorites');
    }

    // Parse and return the JSON data from the API
    const favorites = await response.json();
    
    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    
    // Handle general error response
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
    const { quoteId } = req.method === "DELETE" ? await req.json() : {};
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
    const externalResponse = await fetch(`${API_BASE_URL}/favorites/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle response from the external API
    if (!externalResponse.ok) {
      const errorDetails = await externalResponse.json();
      return NextResponse.json(
        JSON.stringify({ error: "Failed to delete favorite", details: errorDetails }),
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
