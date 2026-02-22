import { useState, useRef, useEffect, useCallback } from "react";

export type RecordingState =
  | "idle"
  | "RECORDING"
  | "paused"
  | "PROCESSING"
  | "COMPLETE";

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isFinal: boolean;
}

export default function useRecording() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const [transcriptSegments, setTranscriptSegments] = useState<
    TranscriptSegment[]
  >([]);
  const [fullTranscript, setFullTranscript] = useState("");
  const [title, setTitle] = useState("");
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  // ⏱ Timer
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

  // Convert Float32Array to base64 PCM16
  const floatTo16BitPCM = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const uint8Array = new Uint8Array(int16Array.buffer);
    return btoa(String.fromCharCode(...uint8Array));
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      console.log("WebSocket event:", data.type);

      switch (data.type) {
        case "session.created":
          console.log("Session created:", data.session.id);
          break;

        case "session.updated":
          console.log("Session updated");
          break;

        case "input_audio_buffer.speech_started":
          console.log(" Speech started");
          break;

        case "input_audio_buffer.speech_stopped":
          console.log(" Speech stopped");
          break;

        case "conversation.item.input_audio_transcription.completed": {
          const transcript = data.transcript;
          if (transcript && transcript.trim()) {
            console.log("Final transcript:", transcript);

            const segment: TranscriptSegment = {
              id: data.item_id || `seg-${Date.now()}`,
              text: transcript,
              startTime: Math.max(0, currentTime - 3),
              endTime: currentTime,
              isFinal: true,
            };

            setTranscriptSegments((prev) => [...prev, segment]);
            setFullTranscript((prev) =>
              prev ? prev + " " + transcript : transcript,
            );
            setLiveTranscript((prev) => [...prev, transcript]);
          }
          break;
        }

        case "conversation.item.input_audio_transcription.failed":
          console.error("Transcription failed:", data.error);
          break;

        case "error":
          console.error("API Error:", data.error);
          break;

        case "response.done":
        case "response.created":
        case "response.output_item.added":
        case "response.output_item.done":
          break;

        default:
          console.log("ℹUnhandled event:", data.type);
      }
    } catch (err) {
      console.error("Failed to parse WebSocket message:", err);
    }
  }, []);

  // 🎙 Start Recording
  const startRecording = useCallback(
    async (meetingTitle?: string, meetingIdParam?: string) => {
      setTitle(meetingTitle || `Meeting - ${new Date().toLocaleString()}`);
      setMeetingId(meetingIdParam || null);
      setRecordingTime(0);
      setLiveTranscript([]);
      setTranscriptSegments([]);
      setFullTranscript("");
      startTimeRef.current = Date.now();
      isPausedRef.current = false;

      try {
        console.log("🎙️ Starting recording...");

        const tokenRes = await fetch("/api/realtime-session");
        if (!tokenRes.ok) {
          throw new Error(`Failed to get session: ${tokenRes.statusText}`);
        }

        const { apiKey, model } = await tokenRes.json();
        if (!apiKey) {
          throw new Error("No API key received");
        }

        // Connect to WebSocket
        const wsUrl = `wss://api.openai.com/v1/realtime?model=${model}`;
        console.log("Connecting to WebSocket:", wsUrl);

        const ws = new WebSocket(wsUrl, [
          "realtime",
          `openai-insecure-api-key.${apiKey}`,
          "openai-beta.realtime-v1",
        ]);

        websocketRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");

          // Configure session for transcription
          ws.send(
            JSON.stringify({
              type: "session.update",
              session: {
                modalities: ["text"],
                instructions:
                  "Transcribe the audio accurately. Do not respond.",
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
            }),
          );
          console.log("Session configuration sent");
        };

        ws.onmessage = handleWebSocketMessage;

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = (event) => {
          console.log("🔌 WebSocket closed:", event.code, event.reason);
          if (event.code !== 1000) {
            console.error("Abnormal WebSocket closure");
          }
        };

        //  Get microphone access
        console.log(" Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 24000,
            channelCount: 1,
          },
        });
        mediaStreamRef.current = stream;
        console.log(" Microphone access granted");

        //  Setup audio processing
        const audioContext = new AudioContext({ sampleRate: 24000 });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN && !isPausedRef.current) {
            const inputData = e.inputBuffer.getChannelData(0);
            const base64Audio = floatTo16BitPCM(inputData);

            ws.send(
              JSON.stringify({
                type: "input_audio_buffer.append",
                audio: base64Audio,
              }),
            );
          }
        };

        setRecordingState("RECORDING");
        console.log("✅ Recording started successfully");
      } catch (err) {
        console.error("Failed to start recording:", err);
        setRecordingState("idle");

        // Cleanup on error
        if (websocketRef.current) {
          websocketRef.current.close();
          websocketRef.current = null;
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        throw err;
      }
    },
    [handleWebSocketMessage],
  );

  // ⏸ Pause / Resume
  const pauseResumeAudio = useCallback(() => {
    if (recordingState === "RECORDING") {
      isPausedRef.current = true;
      setRecordingState("paused");
      console.log("⏸️  Recording paused");
    } else if (recordingState === "paused") {
      isPausedRef.current = false;
      setRecordingState("RECORDING");
      console.log("▶️  Recording resumed");
    }
  }, [recordingState]);

  // Stop Recording
  const stopRecording = useCallback(() => {
    console.log("⏹️  Stopping recording...");

    // Send final audio buffer commit
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.send(
        JSON.stringify({
          type: "input_audio_buffer.commit",
        }),
      );
    }

    // Close WebSocket
    if (websocketRef.current) {
      websocketRef.current.close(1000, "Recording stopped");
      websocketRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Disconnect processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    setRecordingState("PROCESSING");
    console.log("Recording stopped");
  }, []);

  const complete = useCallback(() => {
    setRecordingState("COMPLETE");
    console.log("Meeting completed");
  }, []);

  const reset = useCallback(() => {
    console.log("Resetting recording state...");

    // Cleanup all resources
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    setRecordingState("idle");
    setRecordingTime(0);
    setLiveTranscript([]);
    setTranscriptSegments([]);
    setFullTranscript("");
    setTitle("");
    setMeetingId(null);
    isPausedRef.current = false;
    console.log("✅ Reset complete");
  }, []);

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
