interface MeetingFormProps {
  title: string;
  setTitle: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
}

export const MeetingForm = ({
  title,
  setTitle,
  notes,
  setNotes,
}: MeetingFormProps) => (
  <div className="space-y-4">
    <div>
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Meeting Title <span className="text-gray-400">(Optional)</span>
      </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Team Standup - Feb 20"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-green)] focus:border-transparent outline-none transition"
      />
    </div>

    <div>
      <label
        htmlFor="notes"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Notes <span className="text-gray-400">(Optional)</span>
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add any notes or context about this meeting..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-green)] focus:border-transparent outline-none transition resize-none"
      />
    </div>

    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
      <p className="text-sm text-gray-600">
        <strong className="text-gray-800">Tip:</strong> Make sure your
        microphone is enabled and working properly before starting the
        recording.
      </p>
    </div>
  </div>
);
