import { X } from "lucide-react";

interface Props {
  status: "idle" | "recording" | "paused" | "processing" | "complete";
  onClose: () => void;
}

export default function MeetingHeader({ status, onClose }: Props) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
      <h2 className="text-2xl font-light">
        {status === "idle"
          ? "Start New Meeting"
          : status === "complete"
            ? "Recording Complete"
            : "Recording in Progress"}
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
}
