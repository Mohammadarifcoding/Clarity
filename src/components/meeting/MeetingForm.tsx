interface MeetingFormProps {
  title: string;
  setTitle: (val: string) => void;
  note: string;
  setNote: (val: string) => void;
}

export const MeetingForm = ({
  title,
  setTitle,
  note,
  setNote,
}: MeetingFormProps) => (
  <div className="space-y-3 sm:space-y-4">
    <div>
      <label
        htmlFor="title"
        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
      >
        Meeting Title <span className="text-gray-400">(Optional)</span>
      </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Team Standup - Feb 20"
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--color-green) focus:border-transparent outline-none transition"
      />
    </div>

    <div>
      <label
        htmlFor="note"
        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
      >
        Note <span className="text-gray-400">(Optional)</span>
      </label>
      <textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add any note or context about this meeting..."
        rows={3}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--color-green) focus:border-transparent outline-none transition resize-none"
      />
    </div>

    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4">
      <p className="text-xs sm:text-sm text-gray-600">
        <strong className="text-gray-800">Tip:</strong> Make sure your
        microphone is enabled and working properly before starting the
        recording.
      </p>
    </div>
  </div>
);
