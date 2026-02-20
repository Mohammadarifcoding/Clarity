import { Mic, Pause, Play, Square } from "lucide-react";
import React from "react";

interface MeetingFooterProps {
  status: "idle" | "recording" | "paused" | "processing" | "complete";
  onClose: () => void;
  onStart: () => void;
  onPauseResume: () => void;
  onStop: () => void;
}

const MeetingFooter = ({
  status,
  onClose,
  onStart,
  onPauseResume,
  onStop,
}: MeetingFooterProps) => {
  return (
    <div className="p-6 border-t border-gray-200 shrink-0">
      {status === "idle" ? (
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5" /> Start Recording
          </button>
        </div>
      ) : (
        (status === "recording" || status === "paused") && (
          <div className="flex gap-3">
            <button
              onClick={onPauseResume}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              {status === "recording" ? (
                <>
                  <Pause className="w-5 h-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Resume
                </>
              )}
            </button>
            <button
              onClick={onStop}
              className="flex-1 px-6 py-3 bg-(--color-charcoal) text-white rounded-xl font-medium hover:bg-(--color-green) transition-colors flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5" /> Stop & Save
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default MeetingFooter;
