"use server";

import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";
import { ChatMessage } from "@prisma/client";
import openaiSdk from "@/src/lib/openai";
import { buildSystemPrompt } from "./chat.prompts";
import { searchMeetingTool, executeTool } from "./chat.tools";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null;
};

// Send message and get direct response
const sendMessage = async (
  meetingId: string,
  message: string,
  chatHistory: ChatMessage[] = [],
): Promise<ResponseType<string>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId: user.id,
      },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    const systemPrompt = buildSystemPrompt(meeting.title, meeting.note);

    // Build messages array with chat history
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add chat history (last 10 messages for context)
    const recentHistory = chatHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role.toLowerCase() as "user" | "assistant",
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    // First call - may trigger tool use
    const response = await openaiSdk.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools: [searchMeetingTool],
      tool_choice: "auto",
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message;

    // Check if tool calls are needed
    if (
      assistantMessage?.tool_calls &&
      assistantMessage.tool_calls.length > 0
    ) {
      // Add assistant message with tool calls to history
      messages.push({
        role: "assistant",
        content: assistantMessage.content || "",
        tool_calls: assistantMessage.tool_calls,
      });

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== "function") continue;
        const args = JSON.parse(toolCall.function.arguments);
        const toolResult = await executeTool(
          toolCall.function.name,
          args,
          meetingId,
        );

        // Add tool result to messages
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      }

      // Make another call with tool results
      const finalResponse = await openaiSdk.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const finalContent =
        finalResponse.choices[0]?.message?.content ||
        "I apologize, but I couldn't generate a response.";

      return {
        success: true,
        data: finalContent,
        error: null,
      };
    }

    // No tool calls - return direct response
    const content =
      assistantMessage?.content ||
      "I apologize, but I couldn't generate a response.";

    return {
      success: true,
      data: content,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

// Save a message to the database
const saveMessage = async (
  meetingId: string,
  content: string,
  role: "USER" | "ASSISTANT",
): Promise<ResponseType<ChatMessage>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify meeting exists and belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId: user.id,
      },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    const message = await prisma.chatMessage.create({
      data: {
        meetingId,
        userId: user.id,
        role,
        content,
        messageType: "TEXT",
      },
    });

    return {
      success: true,
      data: message,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

// Get chat history for a meeting
const getChatHistory = async (
  meetingId: string,
  limit: number = 50,
  offset: number = 0,
): Promise<ChatMessage[] | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    // Verify meeting exists and belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId: user.id,
      },
    });

    if (!meeting) {
      return null;
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        meetingId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: limit,
      skip: offset,
    });

    return messages;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return null;
  }
};

export { sendMessage, getChatHistory, saveMessage };
