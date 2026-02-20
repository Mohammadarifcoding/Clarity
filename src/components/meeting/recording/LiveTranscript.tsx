interface Props {
  transcripts: string[];
  formatTime: (index: number) => string;
}

export default function LiveTranscript({ transcripts, formatTime }: Props) {
  if (!transcripts.length) {
    return (
      <p className="text-sm text-gray-400 italic">
        Transcription will appear here...
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {transcripts.map((text, index) => (
        <div key={index} className="text-sm text-gray-700">
          <span className="text-gray-400 font-mono text-xs">
            [{formatTime((index + 1) * 3)}]
          </span>{" "}
          {text}
        </div>
      ))}
    </div>
  );
}
