import { Mic, Pause, Play, Square } from "lucide-react";
import React from "react";

interface MeetingFooterProps {
  status: "idle" | "RECORDING" | "paused" | "PROCESSING" | "COMPLETE";
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
    <div className="p-4 sm:p-6 border-t border-gray-200 shrink-0">
      {status === "idle" ? (
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 text-white rounded-xl font-medium text-sm sm:text-base hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> Start Recording
          </button>
        </div>
      ) : (
        (status === "RECORDING" || status === "paused") && (
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onPauseResume}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
            >
              {status === "RECORDING" ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" /> Resume
                </>
              )}
            </button>
            <button
              onClick={onStop}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-(--color-charcoal) text-white rounded-xl font-medium text-sm sm:text-base hover:bg-(--color-green) transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Square className="w-4 h-4 sm:w-5 sm:h-5" /> Stop & Save
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default MeetingFooter;
