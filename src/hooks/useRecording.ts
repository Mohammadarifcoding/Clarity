import { useState, useCallback } from "react";
import { useTimer } from "./useTimer";
import { useMockTranscription } from "./useMockTranscription";

export type RecordingState =
  | "idle"
  | "recording"
  | "paused"
  | "processing"
  | "complete";

export function useRecording(onMeetingCreated?: (meeting: any) => void) {
  const [state, setState] = useState<RecordingState>("idle");
  const [time, setTime] = useState(0);
  const [transcripts, setTranscripts] = useState<string[]>([]);

  const addTranscript = useCallback((text: string) => {
    setTranscripts((prev) => [...prev, text]);
  }, []);

  useTimer(state === "recording", () => {
    setTime((prev) => prev + 1);
  });

  useMockTranscription(state === "recording", addTranscript);

  const start = () => {
    setTime(0);
    setTranscripts([]);
    setState("recording");
  };

  const pause = () => {
    setState((prev) => (prev === "recording" ? "paused" : "recording"));
  };

  const stop = () => {
    setState("processing");

    setTimeout(() => {
      setState("complete");

      const meeting = {
        id: Date.now().toString(),
        duration: Math.floor(time / 60),
        transcript: transcripts.join("\n"),
      };

      setTimeout(() => {
        onMeetingCreated?.(meeting);
      }, 1500);
    }, 2000);
  };

  const reset = () => {
    setState("idle");
    setTime(0);
    setTranscripts([]);
  };

  return {
    state,
    time,
    transcripts,
    start,
    pause,
    stop,
    reset,
  };
}
