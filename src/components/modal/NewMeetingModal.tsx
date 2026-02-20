"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Mic, Square, Pause, Play, Loader2 } from "lucide-react";

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated?: (meeting: any) => void;
}

type RecordingState =
  | "idle"
  | "recording"
  | "paused"
  | "processing"
  | "complete";

export default function NewMeetingModal({
  isOpen,
  onClose,
  onMeetingCreated,
}: NewMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (recordingState === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  // Simulate live transcription
  useEffect(() => {
    if (recordingState === "recording") {
      const interval = setInterval(() => {
        const mockTranscripts = [
          "Let's start the meeting...",
          "I think we should focus on the Q2 goals.",
          "Sarah, what are your thoughts on this?",
          "We need to allocate resources for the project.",
          "The deadline is approaching fast.",
          "Let me share my screen to show the data.",
          "Can everyone see this presentation?",
          "I'll take notes on the action items.",
          "We should schedule a follow-up next week.",
          "Does anyone have questions before we wrap up?",
        ];

        const randomTranscript =
          mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
        setLiveTranscript((prev) => [...prev, randomTranscript]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [recordingState]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle start recording
  const handleStartRecording = () => {
    if (!title.trim()) {
      setTitle(`Meeting - ${new Date().toLocaleString()}`);
    }
    setRecordingState("recording");
    setRecordingTime(0);
    setLiveTranscript([]);
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    setRecordingState((prev) =>
      prev === "recording" ? "paused" : "recording",
    );
  };

  // Handle stop recording
  const handleStopRecording = () => {
    setRecordingState("processing");

    // Simulate processing
    setTimeout(() => {
      setRecordingState("complete");

      // Create meeting object
      const newMeeting = {
        id: Date.now().toString(),
        title: title || `Meeting - ${new Date().toLocaleString()}`,
        date: new Date().toISOString(),
        duration: Math.floor(recordingTime / 60),
        status: "complete",
        hasTranscript: true,
        transcript: liveTranscript.join("\n"),
      };

      setTimeout(() => {
        onMeetingCreated?.(newMeeting);
        handleClose();
      }, 1500);
    }, 2000);
  };

  // Handle close
  const handleClose = () => {
    if (recordingState === "recording" || recordingState === "paused") {
      const confirm = window.confirm(
        "Recording is in progress. Are you sure you want to close?",
      );
      if (!confirm) return;
    }

    setTitle("");
    setNotes("");
    setRecordingState("idle");
    setRecordingTime(0);
    setLiveTranscript([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes waveform {
          0%,
          100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-2xl font-light">
              {recordingState === "idle"
                ? "Start New Meeting"
                : recordingState === "complete"
                  ? "Recording Complete"
                  : "Recording in Progress"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {/* Idle State - Form */}
            {recordingState === "idle" && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Meeting Title{" "}
                    <span className="text-gray-400">(Optional)</span>
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
                    <strong className="text-gray-800">Tip:</strong> Make sure
                    your microphone is enabled and working properly before
                    starting the recording.
                  </p>
                </div>
              </div>
            )}

            {/* Recording State */}
            {(recordingState === "recording" ||
              recordingState === "paused") && (
              <div className="space-y-6 h-full flex flex-col">
                {/* Timer and Status */}
                <div className="text-center py-6 flex-shrink-0">
                  <div className="w-24 h-24 mx-auto mb-6 relative flex-shrink-0">
                    <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse-glow"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Mic
                        className={`w-12 h-12 ${recordingState === "recording" ? "text-red-500" : "text-gray-400"}`}
                      />
                    </div>
                    {recordingState === "recording" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>

                  <div className="text-5xl font-light text-gray-800 mb-2 tabular-nums">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {recordingState === "recording" ? "Recording..." : "Paused"}
                  </div>
                </div>

                {/* Waveform Visualization */}
                {recordingState === "recording" && (
                  <div className="flex items-end justify-center gap-1 h-16 bg-gray-50 rounded-xl px-4 flex-shrink-0">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-[var(--color-green)] rounded-full origin-bottom flex-shrink-0"
                        style={{
                          height: "100%",
                          animation: "waveform 1.2s ease-in-out infinite",
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Live Transcription */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex-shrink-0">
                    Live Transcription
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl flex-1 min-h-0 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
                      {liveTranscript.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">
                          Transcription will appear here...
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {liveTranscript.map((text, index) => (
                            <div key={index} className="text-sm text-gray-700">
                              <span className="text-gray-400 tabular-nums inline-block min-w-[60px] font-mono text-xs">
                                [{formatTime((index + 1) * 3)}]
                              </span>{" "}
                              <span className="break-words">{text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Processing State */}
            {recordingState === "processing" && (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 text-[var(--color-green)] animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Processing Recording
                </h3>
                <p className="text-gray-600">
                  AI is transcribing and analyzing your meeting...
                </p>
              </div>
            )}

            {/* Complete State */}
            {recordingState === "complete" && (
              <div className="text-center py-12">
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
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Recording Complete!
                </h3>
                <p className="text-gray-600 mb-1">
                  Duration: {formatTime(recordingTime)}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to your meeting...
                </p>
              </div>
            )}
          </div>

          {/* Footer - Actions */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            {recordingState === "idle" && (
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartRecording}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Start Recording
                </button>
              </div>
            )}

            {(recordingState === "recording" ||
              recordingState === "paused") && (
              <div className="flex gap-3">
                <button
                  onClick={handlePauseResume}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  {recordingState === "recording" ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Resume
                    </>
                  )}
                </button>
                <button
                  onClick={handleStopRecording}
                  className="flex-1 px-6 py-3 bg-[var(--color-charcoal)] text-white rounded-xl font-medium hover:bg-[var(--color-green)] transition-colors flex items-center justify-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop & Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
