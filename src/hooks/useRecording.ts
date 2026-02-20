import { useState, useRef, useEffect, useCallback } from "react";

export type RecordingState =
  | "idle"
  | "recording"
  | "paused"
  | "processing"
  | "complete";

export default function useRecording() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (recordingState === "recording") {
      timerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1000,
      );
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  useEffect(() => {
    if (recordingState !== "recording") return;

    const interval = setInterval(() => {
      const mockTranscripts = [
        "Let's start the meeting...",
        "Focus on Q2 goals",
        "Sarah, your thoughts?",
        "Allocate project resources",
        "Deadline is near",
        "Sharing screen...",
        "Can everyone see this?",
        "Noting action items",
        "Schedule follow-up",
        "Any questions?",
      ];
      setLiveTranscript((prev) => [
        ...prev,
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)],
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [recordingState]);

  const start = useCallback((meetingTitle?: string) => {
    setTitle(meetingTitle || `Meeting - ${new Date().toLocaleString()}`);
    setRecordingTime(0);
    setLiveTranscript([]);
    setRecordingState("recording");
  }, []);

  const pauseResume = useCallback(() => {
    setRecordingState((prev) =>
      prev === "recording" ? "paused" : "recording",
    );
  }, []);

  const stop = useCallback(() => setRecordingState("processing"), []);

  const complete = useCallback(() => setRecordingState("complete"), []);

  const reset = useCallback(() => {
    setRecordingState("idle");
    setRecordingTime(0);
    setLiveTranscript([]);
    setTitle("");
  }, []);

  return {
    recordingState,
    recordingTime,
    liveTranscript,
    title,
    start,
    pauseResume,
    stop,
    complete,
    reset,
    setTitle,
  };
}
