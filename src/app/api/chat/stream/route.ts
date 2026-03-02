import { NextRequest } from "next/server";
import openaiSdk from "@/src/lib/openai";
import { getChatHistory } from "@/src/server/modules/chat/chat.action";
import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";
import { buildSystemPrompt } from "@/src/server/modules/chat/chat.prompts";
import {
  executeTool,
  searchMeetingTool,
} from "@/src/server/modules/chat/chat.tools";

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
    const { meetingId } = body;

    if (!meetingId) {
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
    const messages: any[] = [];
    if (meeting.aiSummary) {
      messages.push({
        role: "system",
        content: buildSystemPrompt(
          meeting.title,
          meeting.note,
          meeting.aiSummary,
        ),
      });
    }

    chatHistory.data?.forEach((msg) => {
      messages.push({
        role: msg.role.toLowerCase(),
        content: msg.content,
      });
    });

 
    let response = await openaiSdk.responses.create({
      model: "gpt-4o",
      input: messages,
      tools: [searchMeetingTool],
      tool_choice: "required",
    });
    const updatedMessages = [...messages];
    response.output.forEach((item) => {
      updatedMessages.push(item);
    });
   
    const toolOutputs = [];
    for (const item of response.output) {
      if (item.type === "function_call") {
        const data = await executeTool(
          item.name,
          JSON.parse(item.arguments),
          meetingId,
        );

        toolOutputs.push({
          type: "function_call_output",
          call_id: item.call_id,
          output: JSON.stringify(data),
        });
      }
    }


    if (toolOutputs.length > 0) {
      response = await openaiSdk.responses.create({
        model: "gpt-4o",
        input: [...updatedMessages, ...toolOutputs],
      });

      // Extract text from finalResponse
      const assistantStep = response.output.find((o) => o.type === "message");
      const textContent = assistantStep?.content?.find(
        (c) => c.type === "output_text",
      )?.text;

      return new Response(
        JSON.stringify({ content: textContent || "No response generated." }),
      );
    }

    
    const textItem = response.output
      .find((o) => o.type === "message")
      ?.content?.find((c) => c.type === "output_text");
    const content = textItem?.text || "No response generated.";

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
