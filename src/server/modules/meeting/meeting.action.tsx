"use server";

import { safeValidateInput } from "@/src/lib/validateInput";
import {
  CompleteMeetingInput,
  completeMeetingSchema,
  CreateMeetingInput,
  createMeetingSchema,
} from "./meeting.types";
import validateUser from "@/src/lib/getCurrentUser";
import { prisma } from "@/src/lib/db";
import { Meeting } from "@prisma/client";

type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null;
};

const createMeeting = async (
  body: CreateMeetingInput,
): Promise<ResponseType<Meeting>> => {
  try {
    const user = await validateUser();
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
    const user = await validateUser();
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

export { createMeeting, completeMeeting };
