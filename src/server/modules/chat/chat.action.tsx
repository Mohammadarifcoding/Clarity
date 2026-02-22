"use server";

import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";
import { ResponseType } from "@/src/types/response";
import { ChatMessage } from "@prisma/client";

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
): Promise<ResponseType<ChatMessage[] | null>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        data: null,
        error: "user not found",
      };
    }

    // Verify meeting exists and belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId: user.id,
      },
    });

    if (!meeting) {
      return {
        success: false,
        data: null,
        error: "meeting not found",
      };
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

    return {
      success: true,
      data: messages,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

export { getChatHistory, saveMessage };
