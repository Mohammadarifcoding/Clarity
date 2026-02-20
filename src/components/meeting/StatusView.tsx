import { Loader2 } from "lucide-react";

interface StatusViewProps {
  recordingState: "processing" | "complete";
  recordingTime: number;
  formatTime: (s: number) => string;
}

export const StatusView = ({
  recordingState,
  recordingTime,
  formatTime,
}: StatusViewProps) => (
  <div className="text-center py-12">
    {recordingState === "processing" ? (
      <>
        <Loader2 className="w-16 h-16 text-[var(--color-green)] animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Processing Recording
        </h3>
        <p className="text-gray-600">
          AI is transcribing and analyzing your meeting...
        </p>
      </>
    ) : (
      <>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
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
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Recording Complete!
        </h3>
        <p className="text-gray-600 mb-1">
          Duration: {formatTime(recordingTime)}
        </p>
        <p className="text-sm text-gray-500">Redirecting to your meeting...</p>
      </>
    )}
  </div>
);
