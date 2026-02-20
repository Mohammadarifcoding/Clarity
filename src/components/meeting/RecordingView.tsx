import { Mic } from "lucide-react";
import LiveTranscript from "./recording/LiveTranscript";
import Waveform from "./recording/Waveform";

interface RecordingViewProps {
  recordingState: "recording" | "paused";
  recordingTime: number;
  liveTranscript: string[];
  formatTime: (s: number) => string;
}

export const RecordingView = ({
  recordingState,
  recordingTime,
  liveTranscript,
  formatTime,
}: RecordingViewProps) => (
  <div className="space-y-6 h-full flex flex-col">
    {/* Timer and Status */}
    <div className="text-center py-6 shrink-0">
      <div className="w-24 h-24 mx-auto mb-6 relative shrink-0">
        <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse-glow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Mic
            className={`w-12 h-12 ${recordingState === "recording" ? "text-red-500" : "text-gray-400"}`}
          />
        </div>
        {recordingState === "recording" && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>

      <div className="text-5xl font-light text-gray-800 mb-2 tabular-nums">
        {formatTime(recordingTime)}
      </div>
      <div className="text-sm text-gray-500">
        {recordingState === "recording" ? "Recording..." : "Paused"}
      </div>
    </div>

    {/* Waveform */}
    {recordingState === "recording" && <Waveform />}

    {/* Live Transcription */}
    <div className="flex-1 flex flex-col min-h-0">
      <h3 className="text-sm font-medium text-gray-700 mb-2 shrink-0">
        Live Transcription
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-xl flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          <LiveTranscript
            transcripts={liveTranscript}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  </div>
);
