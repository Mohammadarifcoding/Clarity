import { z } from "zod";

export const MeetingStatus = {
  RECORDING: "RECORDING",
  PROCESSING: "PROCESSING",
  COMPLETE: "COMPLETE",
  FAILED: "FAILED",
} as const;

export const MessageRole = {
  USER: "USER",
  ASSISTANT: "ASSISTANT",
  SYSTEM: "SYSTEM",
} as const;

export const MessageType = {
  TEXT: "TEXT",
  VOICE: "VOICE",
} as const;

export const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  note: z.string().optional(),
  status: z.enum(Object.values(MeetingStatus)).default("RECORDING").optional(),
});

export const completeMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  audioDuration: z.number().positive("Duration must be positive"),
  endedAt: z.string().datetime().or(z.date()).optional(),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type CompleteMeetingInput = z.infer<typeof completeMeetingSchema>;
