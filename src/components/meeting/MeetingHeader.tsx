import { X } from "lucide-react";

interface Props {
  status: "idle" | "RECORDING" | "paused" | "PROCESSING" | "COMPLETE";
  onClose: () => void;
}

export default function MeetingHeader({ status, onClose }: Props) {
  return (
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
      <h2 className="text-lg sm:text-xl md:text-2xl font-light">
        {status === "idle"
          ? "Start New Meeting"
          : status === "COMPLETE"
            ? "Recording Complete"
            : "Recording in Progress"}
      </h2>
      <button
        onClick={onClose}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
      </button>
    </div>
  );
}
