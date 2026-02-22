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

export interface RecordingSession {
  meetingId: string | null;
  title: string;
  startTime: number;
}

export interface AudioResources {
  websocket: WebSocket | null;
  mediaStream: MediaStream | null;
  audioContext: AudioContext | null;
  processor: ScriptProcessorNode | null;
}

export interface UseRecordingReturn {
  recordingState: RecordingState;
  recordingTime: number;
  liveTranscript: string[];
  transcriptSegments: TranscriptSegment[];
  fullTranscript: string;
  title: string;
  meetingId: string | null;
  startRecording: (
    meetingTitle?: string,
    meetingIdParam?: string,
  ) => Promise<void>;
  pauseResumeAudio: () => void;
  stopRecording: () => void;
  complete: () => void;
  reset: () => void;
  setTitle: (title: string) => void;
}
