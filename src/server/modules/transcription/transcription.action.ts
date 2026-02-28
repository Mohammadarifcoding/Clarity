"use server";

import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";
import { buildSystemPrompt } from "../chat/chat.prompts";
import { ResponseType } from "@/src/types/response";
import { vectorDb } from "@/src/lib/vectorDb";
import openaiSdk from "@/src/lib/openai";
import { Ai_Summary_prompt } from "@/src/utils/prompt";

interface TranscriptSegmentInput {
  text: string;
  startTime: number;
  endTime: number;
  sequenceNumber: number;
}

interface SaveTranscriptInput {
  meetingId: string;
  fullText: string;
  segments?: TranscriptSegmentInput[];
  wordCount?: number;
  language?: string;
  confidence?: number;
}

// Save full transcript with optional segments
const saveTranscript = async (
  body: SaveTranscriptInput,
): Promise<ResponseType<{ transcriptId: string }>> => {
  try {
    const user = await getCurrentUser();

    const meeting = await prisma.meeting.findFirst({
      where: { id: body.meetingId, userId: user.id },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingTranscript = await tx.transcript.findUnique({
        where: { meetingId: body.meetingId },
      });

      let transcript;

      if (existingTranscript) {
        transcript = await tx.transcript.update({
          where: { meetingId: body.meetingId },
          data: {
            fullText: body.fullText,
            wordCount: body.wordCount || body.fullText.split(/\s+/).length,
            language: body.language || "en",
            confidence: body.confidence,
          },
        });

        if (body.segments?.length) {
          await tx.transcriptSegment.deleteMany({
            where: { transcriptId: transcript.id },
          });
        }
      } else {
        transcript = await tx.transcript.create({
          data: {
            meetingId: body.meetingId,
            fullText: body.fullText,
            wordCount: body.wordCount || body.fullText.split(/\s+/).length,
            language: body.language || "en",
            confidence: body.confidence,
          },
        });
      }

      if (body.segments?.length) {
        await tx.transcriptSegment.createMany({
          data: body.segments.map((segment, index) => ({
            transcriptId: transcript.id,
            text: segment.text,
            startTime: segment.startTime,
            endTime: segment.endTime,
            sequenceNumber: segment.sequenceNumber ?? index,
          })),
        });
      }

      return transcript;
    });

    if (body.segments?.length) {
      try {
        const db = vectorDb.namespace(body.meetingId);

        db.upsertRecords({
          records: body.segments.map((segment, index) => ({
            id: `${result.id}-${index}`,
            meeting_text: segment.text,
            start_time: segment.startTime,
            end_time: segment.endTime,
            sequence_number: segment.sequenceNumber ?? index,
          })),
        });
      } catch (error) {
        // Manual rollback if vector DB fails
        await prisma.transcript.delete({
          where: { id: result.id },
        });

        throw new Error(
          "Vector DB failed. Rolled back DB changes. " +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    }

    return {
      success: true,
      data: { transcriptId: result.id },
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

// Get transcript for a meeting
const getTranscript = async (meetingId: string) => {
  try {
    const user = await getCurrentUser();

    const meeting = await prisma.meeting.findFirst({
      where: { id: meetingId, userId: user.id },
      include: {
        transcript: {
          include: {
            transcriptSegments: {
              orderBy: { sequenceNumber: "asc" },
            },
          },
        },
      },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    return {
      success: true,
      data: meeting.transcript,
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

// Delete transcript
const deleteTranscript = async (meetingId: string) => {
  try {
    const user = await getCurrentUser();

    const meeting = await prisma.meeting.findFirst({
      where: { id: meetingId, userId: user.id },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    await prisma.transcript.delete({
      where: { meetingId },
    });

    return { success: true, data: null, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

// Build and update system prompt for a meeting
const updateMeetingSummary = async (
  meetingId: string,
): Promise<ResponseType<{ meetingId: string; aiSummary: string | null }>> => {
  try {
    const user = await getCurrentUser();

    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId: user.id,
      },
      include: {
        transcript: {
          include: {
            transcriptSegments: {
              orderBy: { sequenceNumber: "asc" },
              select: {
                text: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
      },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    let aiSummary: string | null = null;

    const segments = meeting.transcript?.transcriptSegments ?? [];

    if (segments.length > 0) {
      const payload = {
        title: meeting.title,
        note: meeting.note,
        transcripts: segments.map((s) => {
          return {
            text: s.text,
            startTime: s.startTime,
            endTime: s.endTime,
          };
        }),
      };

      const response = await openaiSdk.responses.create({
        model: "gpt-4o-mini",
        instructions: Ai_Summary_prompt,
        input: JSON.stringify(payload),
      });

      const raw = response.output_text;

      if (!raw) {
        throw new Error("Empty AI response");
      }

      let parsed: { status: "success" | "failed"; data: string | null };

      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error("Invalid JSON from AI");
      }

      if (parsed.status === "success") {
        aiSummary = parsed.data;
      }
    }

    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { aiSummary },
    });

    return {
      success: true,
      data: {
        meetingId: updatedMeeting.id,
        aiSummary: updatedMeeting.aiSummary,
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
export {
  saveTranscript,
  getTranscript,
  deleteTranscript,
  updateMeetingSummary,
};
