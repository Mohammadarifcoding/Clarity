import { X } from "lucide-react";

interface Props {
  title: string;
  onClose: () => void;
}

export default function MeetingHeader({ title, onClose }: Props) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h2 className="text-2xl font-light">{title}</h2>
      <button onClick={onClose}>
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
}
