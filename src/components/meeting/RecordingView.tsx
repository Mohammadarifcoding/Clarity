import { Mic } from "lucide-react";
import LiveTranscript from "./recording/LiveTranscript";
import Waveform from "./recording/Waveform";

interface RecordingViewProps {
  recordingState: "RECORDING" | "paused";
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
  <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
    {/* Timer and Status */}
    <div className="text-center py-4 sm:py-6 shrink-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 relative shrink-0">
        <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse-glow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Mic
            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${recordingState === "RECORDING" ? "text-red-500" : "text-gray-400"}`}
          />
        </div>
        {recordingState === "RECORDING" && (
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>

      <div className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800 mb-1 sm:mb-2 tabular-nums">
        {formatTime(recordingTime)}
      </div>
      <div className="text-xs sm:text-sm text-gray-500">
        {recordingState === "RECORDING" ? "Recording..." : "Paused"}
      </div>
    </div>

    {/* Waveform */}
    {recordingState === "RECORDING" && <Waveform />}

    {/* Live Transcription */}
    <div className="flex-1 flex flex-col min-h-0">
      <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 shrink-0">
        Live Transcription
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-xl flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-custom">
          <LiveTranscript
            transcripts={liveTranscript}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  </div>
);
