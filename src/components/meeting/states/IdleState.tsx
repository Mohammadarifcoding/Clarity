import { Mic } from "lucide-react";

interface Props {
  title: string;
  note: string;
  setTitle: (t: string) => void;
  setNote: (n: string) => void;
  onStart: () => void;
  onCancel: () => void;
}

export default function IdleState({
  title,
  note,
  setTitle,
  setNote,
  onStart,
  onCancel,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Meeting Title <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Team Standup - Feb 20"
          className="w-full px-4 py-3 border rounded-xl"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Note <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Add note about this meeting..."
          className="w-full px-4 py-3 border rounded-xl resize-none"
        />
      </div>

      <div className="bg-blue-50 border p-4 rounded-xl text-sm text-gray-600">
        <strong className="text-gray-800">Tip:</strong> Make sure your
        microphone works before starting.
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border rounded-xl"
        >
          Cancel
        </button>
        <button
          onClick={onStart}
          className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2"
        >
          <Mic className="w-5 h-5" /> Start Recording
        </button>
      </div>
    </div>
  );
}
