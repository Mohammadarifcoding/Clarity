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
export const updateMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  note: z.string().optional(),
  status: z.enum(["RECORDING", "PROCESSING", "COMPLETE", "FAILED"]).optional(),
  audioDuration: z.number().positive("Duration must be positive").optional(),
  endedAt: z.string().datetime().or(z.date()).optional(),
});

export const completeMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  audioDuration: z.number().positive("Duration must be positive"),
  endedAt: z.string().datetime().or(z.date()).optional(),
});

export const deleteMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const getMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const listMeetingsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["RECORDING", "PROCESSING", "COMPLETE", "FAILED"]).optional(),
  limit: z.number().positive().max(100).default(20),
  offset: z.number().nonnegative().default(0),
  sortBy: z.enum(["createdAt", "startedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const searchMeetingsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  query: z.string().min(1, "Search query is required").max(200),
  limit: z.number().positive().max(50).default(10),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
export type CompleteMeetingInput = z.infer<typeof completeMeetingSchema>;
export type DeleteMeetingInput = z.infer<typeof deleteMeetingSchema>;
export type GetMeetingInput = z.infer<typeof getMeetingSchema>;
export type ListMeetingsInput = z.infer<typeof listMeetingsSchema>;
export type SearchMeetingsInput = z.infer<typeof searchMeetingsSchema>;
