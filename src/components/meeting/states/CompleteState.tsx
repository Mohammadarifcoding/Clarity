interface Props {
  duration: number;
}

export default function CompleteState({ duration }: Props) {
  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center py-16">
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

      <h3 className="text-xl font-medium mb-2">Recording Complete!</h3>

      <p className="text-gray-600 mb-1">Duration: {format(duration)}</p>

      <p className="text-sm text-gray-500">Redirecting to your meeting...</p>
    </div>
  );
}
