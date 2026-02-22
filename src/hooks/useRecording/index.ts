import { useState, useCallback, useRef } from "react";
import type {
  RecordingState,
  TranscriptSegment,
  UseRecordingReturn,
} from "./types";
import { useTimer } from "./useTimer";
import { useTranscript } from "./useTranscript";
import { useAudioResources } from "./useAudioResources";
import {
  parseWebSocketMessage,
  createTranscriptSegment,
  getWebSocketProtocols,
  createTranscriptionSessionConfig,
} from "./websocket.utils";

export type { RecordingState, TranscriptSegment, UseRecordingReturn };

export default function useRecording(): UseRecordingReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [title, setTitle] = useState("");
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  // Compose smaller hooks
  const { recordingTime, startTimer, stopTimer, resetTimer } = useTimer();
  const {
    liveTranscript,
    transcriptSegments,
    fullTranscript,
    addTranscript,
    resetTranscript,
  } = useTranscript();
  const {
    resourcesRef,
    isPausedRef,
    setupAudioStream,
    setupAudioProcessor,
    cleanupResources,
    pauseAudio,
    resumeAudio,
  } = useAudioResources();

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      const data = parseWebSocketMessage(event);
      if (!data) return;

      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      switch (data.type) {
        case "conversation.item.input_audio_transcription.completed": {
          const result = createTranscriptSegment(data, currentTime);
          if (result) {
            addTranscript(result.segment, result.text);
          }
          break;
        }
        case "conversation.item.input_audio_transcription.failed":
        case "error":
          console.error(`WebSocket error: ${data.error}`);
          break;
      }
    },
    [addTranscript],
  );

  // Start recording
  const startRecording = useCallback(
    async (meetingTitle?: string, meetingIdParam?: string) => {
      setTitle(meetingTitle || `Meeting - ${new Date().toLocaleString()}`);
      setMeetingId(meetingIdParam || null);
      startTimeRef.current = Date.now();
      isPausedRef.current = false;

      try {
        // Get session token
        const tokenRes = await fetch("/api/realtime-session");
        if (!tokenRes.ok) {
          throw new Error(`Failed to get session: ${tokenRes.statusText}`);
        }

        const { apiKey, model } = await tokenRes.json();
        if (!apiKey) {
          throw new Error("No API key received");
        }

        // Connect WebSocket
        const ws = new WebSocket(
          `wss://api.openai.com/v1/realtime?model=${model}`,
          getWebSocketProtocols(apiKey),
        );
        resourcesRef.current.websocket = ws;

        ws.onopen = () => {
          ws.send(JSON.stringify(createTranscriptionSessionConfig()));
        };

        ws.onmessage = handleWebSocketMessage;
        ws.onclose = (event) => {
          if (event.code !== 1000) {
            console.error("Abnormal WebSocket closure");
          }
        };
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        // Setup audio
        const stream = await setupAudioStream();
        setupAudioProcessor(stream, (base64Audio) => {
          ws.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: base64Audio,
            }),
          );
        });

        setRecordingState("RECORDING");
        startTimer();
      } catch (error) {
        cleanupResources();
        setRecordingState("idle");
        throw error;
      }
    },
    [
      handleWebSocketMessage,
      setupAudioStream,
      setupAudioProcessor,
      cleanupResources,
      startTimer,
      resourcesRef,
      isPausedRef,
    ],
  );

  // Pause / Resume
  const pauseResumeAudio = useCallback(() => {
    if (recordingState === "RECORDING") {
      pauseAudio();
      stopTimer();
      setRecordingState("paused");
    } else if (recordingState === "paused") {
      resumeAudio();
      startTimer();
      setRecordingState("RECORDING");
    }
  }, [recordingState, pauseAudio, resumeAudio, startTimer, stopTimer]);

  // Stop recording
  const stopRecording = useCallback(() => {
    const ws = resourcesRef.current.websocket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
    }
    cleanupResources();
    stopTimer();
    setRecordingState("PROCESSING");
  }, [cleanupResources, stopTimer, resourcesRef]);

  // Complete meeting
  const complete = useCallback(() => {
    setRecordingState("COMPLETE");
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    cleanupResources();
    resetTimer();
    resetTranscript();
    setRecordingState("idle");
    setTitle("");
    setMeetingId(null);
    isPausedRef.current = false;
  }, [cleanupResources, resetTimer, resetTranscript, isPausedRef]);

  return {
    recordingState,
    recordingTime,
    liveTranscript,
    transcriptSegments,
    fullTranscript,
    title,
    meetingId,
    startRecording,
    pauseResumeAudio,
    stopRecording,
    complete,
    reset,
    setTitle,
  };
}
