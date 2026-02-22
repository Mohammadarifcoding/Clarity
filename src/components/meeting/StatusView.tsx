import { Loader2 } from "lucide-react";

interface StatusViewProps {
  recordingState: "PROCESSING" | "COMPLETE";
  recordingTime: number;
  formatTime: (s: number) => string;
}

export const StatusView = ({
  recordingState,
  recordingTime,
  formatTime,
}: StatusViewProps) => (
  <div className="text-center py-8 sm:py-12">
    {recordingState === "PROCESSING" ? (
      <>
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-(--color-green) animate-spin mx-auto mb-3 sm:mb-4" />
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-1.5 sm:mb-2">
          Processing Recording
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          AI is transcribing and analyzing your meeting...
        </p>
      </>
    ) : (
      <>
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-1.5 sm:mb-2">
          Recording Complete!
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-1">
          Duration: {formatTime(recordingTime)}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          Redirecting to your meeting...
        </p>
      </>
    )}
  </div>
);
