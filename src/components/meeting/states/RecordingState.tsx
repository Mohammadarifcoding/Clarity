import { Mic, Pause, Play, Square } from "lucide-react";
import RecordingTimer from "../recording/RecordingTimer";
import Waveform from "../recording/Waveform";
import LiveTranscript from "../recording/LiveTranscript";

interface Props {
  state: "recording" | "paused";
  time: number;
  transcripts: string[];
  pause: () => void;
  stop: () => void;
}

export default function RecordingState({
  state,
  time,
  transcripts,
  pause,
  stop,
}: Props) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Mic + Timer */}
        <div className="text-center py-6">
          <Mic
            className={`w-12 h-12 mx-auto ${
              state === "recording" ? "text-red-500" : "text-gray-400"
            }`}
          />

          <RecordingTimer seconds={time} />

          <p className="text-sm text-gray-500">
            {state === "recording" ? "Recording..." : "Paused"}
          </p>
        </div>

        {/* Waveform */}
        {state === "recording" && <Waveform />}

        {/* Transcript */}
        <div>
          <h3 className="text-sm font-medium mb-2">Live Transcription</h3>
          <div className="bg-gray-50 border rounded-xl p-4 max-h-64 overflow-y-auto">
            <LiveTranscript transcripts={transcripts} formatTime={formatTime} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={pause}
          className="flex-1 px-6 py-3 border-2 rounded-xl flex items-center justify-center gap-2"
        >
          {state === "recording" ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Resume
            </>
          )}
        </button>

        <button
          onClick={stop}
          className="flex-1 px-6 py-3 bg-[var(--color-charcoal)] text-white rounded-xl flex items-center justify-center gap-2"
        >
          <Square className="w-5 h-5" />
          Stop & Save
        </button>
      </div>
    </div>
  );
}
