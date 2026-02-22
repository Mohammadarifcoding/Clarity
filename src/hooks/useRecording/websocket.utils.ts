import type { TranscriptSegment } from "./types";

export type WebSocketEventType =
  | "session.created"
  | "session.updated"
  | "input_audio_buffer.speech_started"
  | "input_audio_buffer.speech_stopped"
  | "conversation.item.input_audio_transcription.completed"
  | "conversation.item.input_audio_transcription.failed"
  | "error"
  | "response.done"
  | "response.created"
  | "response.output_item.added"
  | "response.output_item.done";

export interface WebSocketMessage {
  type: WebSocketEventType;
  session?: { id: string };
  transcript?: string;
  item_id?: string;
  error?: string;
}

export interface TranscriptResult {
  segment: TranscriptSegment;
  text: string;
}

/**
 * Parse WebSocket message and extract relevant data
 */
export const parseWebSocketMessage = (
  event: MessageEvent,
): WebSocketMessage | null => {
  try {
    return JSON.parse(event.data);
  } catch {
    console.error("Failed to parse WebSocket message");
    return null;
  }
};

/**
 * Check if message is a final transcript
 */
export const isFinalTranscript = (
  data: WebSocketMessage,
): data is WebSocketMessage & { transcript: string } => {
  return (
    data.type === "conversation.item.input_audio_transcription.completed" &&
    !!data.transcript?.trim()
  );
};

/**
 * Create transcript segment from WebSocket data
 */
export const createTranscriptSegment = (
  data: WebSocketMessage,
  currentTime: number,
): TranscriptResult | null => {
  if (!isFinalTranscript(data)) return null;

  return {
    segment: {
      id: data.item_id || `seg-${Date.now()}`,
      text: data.transcript,
      startTime: Math.max(0, currentTime - 3),
      endTime: currentTime,
      isFinal: true,
    },
    text: data.transcript,
  };
};

/**
 * Get WebSocket subprotocols for OpenAI Realtime API
 */
export const getWebSocketProtocols = (apiKey: string): string[] => [
  "realtime",
  `openai-insecure-api-key.${apiKey}`,
  "openai-beta.realtime-v1",
];

/**
 * Create session configuration for transcription-only mode
 */
export const createTranscriptionSessionConfig = () => ({
  type: "session.update",
  session: {
    modalities: ["text"],
    instructions: "Transcribe the audio accurately. Do not respond.",
    input_audio_format: "pcm16",
    input_audio_transcription: {
      model: "whisper-1",
      language: "en",
    },
    turn_detection: {
      type: "server_vad",
      threshold: 0.5,
      prefix_padding_ms: 500,
      silence_duration_ms: 700,
    },
  },
});
