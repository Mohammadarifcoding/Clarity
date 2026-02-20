import { useEffect } from "react";

const mockTranscripts = [
  "Let's start the meeting...",
  "I think we should focus on the Q2 goals.",
  "Sarah, what are your thoughts on this?",
  "We need to allocate resources for the project.",
  "The deadline is approaching fast.",
];

export function useMockTranscription(
  isRecording: boolean,
  addTranscript: (text: string) => void,
) {
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      const random =
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      addTranscript(random);
    }, 3000);

    return () => clearInterval(interval);
  }, [isRecording, addTranscript]);
}
