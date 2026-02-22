"use server";

import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";
import { ChatMessage } from "@prisma/client";

type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null;
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

export { getChatHistory, saveMessage };
