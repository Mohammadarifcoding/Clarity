import { z } from "zod";

export const addTranscriptSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  fullText: z.string().min(1, "Transcript text is required"),
  wordCount: z.number().positive().optional(),
  language: z
    .string()
    .length(2, "Language must be 2 characters (e.g., 'en')")
    .optional(),
  confidence: z
    .number()
    .min(0)
    .max(1, "Confidence must be between 0 and 1")
    .optional(),
  embeddingId: z.string().optional(),
});

export const addTranscriptSegmentSchema = z.object({
  transcriptId: z.string().min(1, "Transcript ID is required"),
  text: z.string().min(1, "Segment text is required"),
  startTime: z.number().nonnegative("Start time must be non-negative"),
  endTime: z.number().positive("End time must be positive"),
  sequenceNumber: z.number().nonnegative(),
});

export const addBulkTranscriptSegmentsSchema = z.object({
  transcriptId: z.string().min(1, "Transcript ID is required"),
  segments: z
    .array(
      z.object({
        text: z.string().min(1, "Segment text is required"),
        speaker: z.string().optional(),
        startTime: z.number().nonnegative(),
        endTime: z.number().positive(),
        confidence: z.number().min(0).max(1).optional(),
        sequenceNumber: z.number().nonnegative(),
      }),
    )
    .min(1, "At least one segment is required"),
});

export const getTranscriptSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  includeSegments: z.boolean().default(false),
});
export type AddTranscriptInput = z.infer<typeof addTranscriptSchema>;
export type AddTranscriptSegmentInput = z.infer<
  typeof addTranscriptSegmentSchema
>;
export type AddBulkTranscriptSegmentsInput = z.infer<
  typeof addBulkTranscriptSegmentsSchema
>;
export type GetTranscriptInput = z.infer<typeof getTranscriptSchema>;
