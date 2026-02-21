import { z } from "zod";

export const sendChatMessageSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  userId: z.string().min(1, "User ID is required"),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(5000, "Message too long"),
  messageType: z.enum(["TEXT", "VOICE"]).default("TEXT"),
  audioUrl: z.string().url("Invalid audio URL").optional(),
});

export const getChatHistorySchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  limit: z.number().positive().max(100).default(50),
  offset: z.number().nonnegative().default(0),
});

export const saveChatResponseSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  userId: z.string().min(1, "User ID is required"),
  content: z.string().min(1, "Response content is required"),
  tokensUsed: z.number().positive().optional(),
  modelUsed: z.string().optional(),
});
export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
export type GetChatHistoryInput = z.infer<typeof getChatHistorySchema>;
export type SaveChatResponseInput = z.infer<typeof saveChatResponseSchema>;
