import { useState } from "react";
import { Mic } from "lucide-react";

interface Props {
  onStart: (payload: { title: string; notes: string }) => void;
  onCancel?: () => void;
}

export default function IdleState({ onStart, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const handleStart = () => {
    onStart({
      title: title.trim() || `Meeting - ${new Date().toLocaleString()}`,
      notes,
    });
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Meeting Title <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Team Sync - Feb 20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Notes <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border rounded-xl resize-none"
            placeholder="Context about this meeting..."
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={handleStart}
          className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2"
        >
          <Mic className="w-5 h-5" />
          Start Recording
        </button>
      </div>
    </div>
  );
}
