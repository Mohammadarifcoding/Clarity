"use server";

import { prisma } from "@/src/lib/db";
import getCurrentUser from "@/src/lib/getCurrentUser";

type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null;
};

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

    // Verify meeting belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: { id: body.meetingId, userId: user.id },
    });

    if (!meeting) {
      throw new Error("Meeting not found or access denied");
    }

    // Check if transcript already exists
    const existingTranscript = await prisma.transcript.findUnique({
      where: { meetingId: body.meetingId },
    });

    let transcript;

    if (existingTranscript) {
      // Update existing transcript
      transcript = await prisma.transcript.update({
        where: { meetingId: body.meetingId },
        data: {
          fullText: body.fullText,
          wordCount: body.wordCount || body.fullText.split(/\s+/).length,
          language: body.language || "en",
          confidence: body.confidence,
        },
      });

      // Delete old segments if we have new ones
      if (body.segments && body.segments.length > 0) {
        await prisma.transcriptSegment.deleteMany({
          where: { transcriptId: transcript.id },
        });
      }
    } else {
      // Create new transcript
      transcript = await prisma.transcript.create({
        data: {
          meetingId: body.meetingId,
          fullText: body.fullText,
          wordCount: body.wordCount || body.fullText.split(/\s+/).length,
          language: body.language || "en",
          confidence: body.confidence,
        },
      });
    }

    // Create segments if provided
    if (body.segments && body.segments.length > 0) {
      await prisma.transcriptSegment.createMany({
        data: body.segments.map((segment, index) => ({
          transcriptId: transcript.id,
          text: segment.text,
          startTime: segment.startTime,
          endTime: segment.endTime,
          sequenceNumber: segment.sequenceNumber ?? index,
        })),
      });
    }

    return {
      success: true,
      data: { transcriptId: transcript.id },
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



export { saveTranscript, getTranscript, deleteTranscript };
