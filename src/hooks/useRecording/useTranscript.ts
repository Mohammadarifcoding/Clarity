import { useState, useCallback } from "react";
import type { TranscriptSegment } from "./types";

export interface UseTranscriptReturn {
  liveTranscript: string[];
  transcriptSegments: TranscriptSegment[];
  fullTranscript: string;
  addTranscript: (segment: TranscriptSegment, text: string) => void;
  resetTranscript: () => void;
}

export const useTranscript = (): UseTranscriptReturn => {
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const [transcriptSegments, setTranscriptSegments] = useState<
    TranscriptSegment[]
  >([]);
  const [fullTranscript, setFullTranscript] = useState("");

  const addTranscript = useCallback(
    (segment: TranscriptSegment, text: string) => {
      setTranscriptSegments((prev) => [...prev, segment]);
      setFullTranscript((prev) => (prev ? `${prev} ${text}` : text));
      setLiveTranscript((prev) => [...prev, text]);
    },
    [],
  );

  const resetTranscript = useCallback(() => {
    setLiveTranscript([]);
    setTranscriptSegments([]);
    setFullTranscript("");
  }, []);

  return {
    liveTranscript,
    transcriptSegments,
    fullTranscript,
    addTranscript,
    resetTranscript,
  };
};
