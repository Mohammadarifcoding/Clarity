import { useState, useEffect, useRef, useCallback } from "react";

export interface UseTimerReturn {
  recordingTime: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = (): UseTimerReturn => {
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  }, [clearTimer]);

  const stopTimer = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setRecordingTime(0);
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    recordingTime,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
