"use server";

import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";
import { sendChatMessageSchema } from "./chat.type";
import { safeValidateInput } from "@/src/lib/validateInput";
import { ChatMessage } from "@prisma/client";

type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null;
};

// Dummy responses for testing
const DUMMY_RESPONSES = [
  "Hi! I'm your meeting assistant. How can I help you today?",
  "That's an interesting question! Based on the meeting transcript, I can help you explore that topic further.",
  "I understand what you're asking. Let me analyze the meeting content for you.",
  "Great question! From what I can see in the meeting, here's what I found...",
  "I'm here to help you understand this meeting better. What specific aspect would you like to explore?",
  "Based on the discussion in this meeting, I can provide some insights on that topic.",
  "Let me help you with that. The meeting covered several important points related to your question.",
];

// Get a random dummy response
const getDummyResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * DUMMY_RESPONSES.length);
  return DUMMY_RESPONSES[randomIndex];
};

// Send a message and get a dummy response
const sendMessage = async (
  body: Omit<(typeof sendChatMessageSchema)["_input"], "userId" | "audioUrl">,
): Promise<
  ResponseType<{
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
  }>
> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const result = await safeValidateInput(sendChatMessageSchema, {
      ...body,
      userId: user.id,
      messageType: body.messageType || "TEXT",
    });

    if (!result.success) {
      throw new Error("Invalid input: " + JSON.stringify(result.errors));
    }

    // Verify meeting exists and belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: result.data.meetingId,
        userId: user.id,
      },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    // Create user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        meetingId: result.data.meetingId,
        userId: user.id,
        role: "USER",
        content: result.data.content,
        messageType: result.data.messageType || "TEXT",
      },
    });

    // Create assistant message with dummy response
    const dummyResponse = getDummyResponse();
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        meetingId: result.data.meetingId,
        userId: user.id,
        role: "ASSISTANT",
        content: dummyResponse,
        messageType: "TEXT",
      },
    });

    return {
      success: true,
      data: {
        userMessage,
        assistantMessage,
      },
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

export { sendMessage, getChatHistory };
