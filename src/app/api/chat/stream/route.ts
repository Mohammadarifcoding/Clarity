import { NextRequest } from "next/server";
import openaiSdk from "@/src/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await openaiSdk.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
    });

    const content =
      response.choices[0]?.message?.content || "No response generated.";

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
