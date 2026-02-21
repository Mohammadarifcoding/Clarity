import { useState, useRef, useEffect, useCallback } from "react";

export type RecordingState =
  | "idle"
  | "RECORDING"
  | "paused"
  | "PROCESSING"
  | "COMPLETE";

export default function useRecording() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [meetingId, setMeetingId] = useState<string | null>(null);

  // Media
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (recordingState === "RECORDING") {
      timerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1000,
      );
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  // Mock transcript (replace with real API streaming)
  useEffect(() => {
    if (recordingState !== "RECORDING") return;

    const interval = setInterval(() => {
      const mockTranscripts = [
        "Let's start the meeting...",
        "Focus on Q2 goals",
        "Sarah, your thoughts?",
        "Allocate project resources",
        "Deadline is near",
      ];
      setLiveTranscript((prev) => [
        ...prev,
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)],
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [recordingState]);

  // Start recording
  const startRecording = useCallback(
    async (
      meetingTitle?: string,
      meetingId?: string,
      onDataChunk?: (chunk: Blob) => void,
    ) => {
      setTitle(meetingTitle || `Meeting - ${new Date().toLocaleString()}`);
      setMeetingId(meetingId || null);
      setRecordingTime(0);
      setLiveTranscript([]);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        // Stream chunks on the fly
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && onDataChunk) onDataChunk(e.data); // send immediately
        };

        recorder.start(1000); // emit every second
        setRecordingState("RECORDING");
      } catch (err) {
        console.error("Microphone access denied or error:", err);
      }
    },
    [],
  );

  // Pause/resume
  const pauseResumeAudio = useCallback(() => {
    if (!mediaRecorder) return;
    if (recordingState === "RECORDING") {
      mediaRecorder.pause();
      setRecordingState("paused");
    } else if (recordingState === "paused") {
      mediaRecorder.resume();
      setRecordingState("RECORDING");
    }
  }, [mediaRecorder, recordingState]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setRecordingState("PROCESSING");
  }, [mediaRecorder]);

  // Complete
  const complete = useCallback(() => setRecordingState("COMPLETE"), []);

  // Reset
  const reset = useCallback(() => {
    setRecordingState("idle");
    setRecordingTime(0);
    setLiveTranscript([]);
    setTitle("");
    setMeetingId(null);
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  return {
    recordingState,
    recordingTime,
    liveTranscript,
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
