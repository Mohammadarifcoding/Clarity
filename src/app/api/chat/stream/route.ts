import { NextRequest } from "next/server";
import openaiSdk from "@/src/lib/openai";
import { getChatHistory } from "@/src/server/modules/chat/chat.action";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { message, meetingId } = body;

    if (!message || !meetingId) {
      return new Response(
        JSON.stringify({ error: "Message and meetingId are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Get meeting with stored system prompt
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId: user.id,
      },
    });

    if (!meeting) {
      return new Response(JSON.stringify({ error: "Meeting not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get chat history
    const chatHistory = await getChatHistory(meetingId);

    const messages: ChatCompletionMessageParam[] = [];

    if (meeting.systemPrompt) {
      messages.push({ role: "system", content: meeting.systemPrompt });
    }

    // Add chat history
    chatHistory.data?.forEach((msg) => {
      messages.push({
        role: msg.role.toLowerCase() as "user" | "assistant",
        content: msg.content,
      });
    });

    // Add current user message
    console.log(messages);

    const response = await openaiSdk.chat.completions.create({
      model: "gpt-5-mini",
      messages,
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
