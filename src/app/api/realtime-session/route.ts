import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";

export async function GET() {
  try {
    // Get current session using Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.error("Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    console.log(" Returning API key for user:", session.user.id);

    return NextResponse.json({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-realtime-preview-2024-10-01",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
