import { NextRequest, NextResponse } from "next/server";


const API_BASE_URL = process.env.API_BASE_URL


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {
        const userId = (await params).id

        // Construct the API URL
        const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);

        if (!response.ok) {
            // Error handling if the response is not ok
            throw new Error('Failed to fetch favorites');
        }

        // Parse and return the JSON data from the API
        const favorites = await response.json();

        console.log(favorites)

        return NextResponse.json(favorites, { status: 200 });
    } catch (error) {
        console.error('Error fetching favorites:', error);

        // Handle general error response
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {

        const userId = (await params).id

        console.log(userId)

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
            quoteId
        };

        // Step 4: Send data to external API
        const externalResponse = await fetch(`${API_BASE_URL}/favorites`, {
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


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Step 1: Authenticate user and extract userId
        // const { userId } = await auth(); // From Clerk middleware or auth helper

        const userId = (await params).id

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

