"use server";

import { safeValidateInput } from "@/src/lib/validateInput";
import {
  CompleteMeetingInput,
  completeMeetingSchema,
  CreateMeetingInput,
  createMeetingSchema,
} from "./meeting.types";

import { prisma } from "@/src/lib/db";
import { Meeting } from "@prisma/client";
import getCurrentUser from "@/src/lib/getCurrentUser";

type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null;
};

const createMeeting = async (
  body: CreateMeetingInput,
): Promise<ResponseType<Meeting>> => {
  try {
    const user = await getCurrentUser();
    const result = await safeValidateInput(createMeetingSchema, body);

    if (!result.success) {
      throw new Error("Invalid input: " + JSON.stringify(result.errors));
    }

    const meeting = await prisma.meeting.create({
      data: {
        title: result.data.title,
        note: result.data.note,
        userId: user.id,
      },
    });

    return { success: true, data: meeting, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

const completeMeeting = async (
  body: CompleteMeetingInput,
): Promise<ResponseType<Meeting>> => {
  try {
    const user = await getCurrentUser();
    const result = await safeValidateInput(completeMeetingSchema, body);

    if (!result.success) {
      throw new Error("Invalid input: " + JSON.stringify(result.errors));
    }

    // Check to ensure it belongs to the user
    const meetingExists = await prisma.meeting.findFirst({
      where: { id: result.data.meetingId, userId: user.id },
    });

    if (!meetingExists) {
      throw new Error("Meeting not found or access denied");
    }

    const meeting = await prisma.meeting.update({
      where: { id: result.data.meetingId },
      data: {
        status: "COMPLETE",
        audioDuration: result.data.audioDuration,
        endedAt: result.data.endedAt
          ? new Date(result.data.endedAt)
          : new Date(),
      },
    });

    return { success: true, data: meeting, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

const deleteMeeting = async (
  meetingId: string,
): Promise<ResponseType<null>> => {
  try {
    const user = await getCurrentUser();
    const meetingExists = await prisma.meeting.findFirst({
      where: { id: meetingId, userId: user.id },
    });

    if (!meetingExists) {
      throw new Error("Meeting not found or access denied");
    }

    await prisma.meeting.delete({ where: { id: meetingId } });
    return { success: true, data: null, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

const listMeetings = async () => {
  try {
    const user = await getCurrentUser();
    const meetings = await prisma.meeting.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: meetings, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

const getMeetingById = async (meetingId: string) => {
  try {
    const user = await getCurrentUser();
    const meeting = await prisma.meeting.findFirst({
      where: { id: meetingId, userId: user.id },
    });
    return meeting;
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return null;
  }
};

export {
  createMeeting,
  completeMeeting,
  listMeetings,
  deleteMeeting,
  getMeetingById,
};
