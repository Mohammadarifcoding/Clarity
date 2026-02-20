"use client";

import React, { useState } from "react";
import { MeetingForm } from "./MeetingForm";
import { RecordingView } from "./RecordingView";
import { StatusView } from "./StatusView";
import { formatTime } from "@/src/utils/formatTime";
import MeetingHeader from "./MeetingHeader";
import MeetingFooter from "./MeetingFooter";
import useRecording from "@/src/hooks/useRecording";
import { Meeting } from "@/src/types/meeting";
interface MainMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated?: (meeting: Meeting) => void;
}

export default function MeetingModal({
  isOpen,
  onClose,
  onMeetingCreated,
}: MainMeetingModalProps) {
  const {
    recordingState,
    recordingTime,
    liveTranscript,
    title,
    setTitle,
    start,
    pauseResume,
    stop,
    complete,
    reset,
  } = useRecording();

  const [notes, setNotes] = useState("");

  const handleStopRecording = () => {
    stop();

    setTimeout(() => {
      complete();

      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: title || `Meeting - ${new Date().toLocaleString()}`,
        date: new Date().toISOString(),
        duration: Math.floor(recordingTime / 60),
        status: "complete",
        hasTranscript: true,
        transcript: liveTranscript.join("\n"),
        notes: notes,
      };

      // Final redirect/close delay
      setTimeout(() => {
        onMeetingCreated?.(newMeeting);
        handleClose();
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    if (
      (recordingState === "recording" || recordingState === "paused") &&
      !window.confirm("Recording in progress... close?")
    ) {
      return;
    }
    setNotes("");
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Keeping the specific keyframe for the RecordingView waveform */}
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[700px] flex flex-col animate-scale-in">
          <MeetingHeader status={recordingState} onClose={handleClose} />

          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {recordingState === "idle" && (
              <MeetingForm
                title={title}
                setTitle={setTitle}
                notes={notes}
                setNotes={setNotes}
              />
            )}

            {(recordingState === "recording" ||
              recordingState === "paused") && (
              <RecordingView
                recordingState={recordingState}
                recordingTime={recordingTime}
                liveTranscript={liveTranscript}
                formatTime={formatTime}
              />
            )}

            {(recordingState === "processing" ||
              recordingState === "complete") && (
              <StatusView
                recordingState={recordingState}
                recordingTime={recordingTime}
                formatTime={formatTime}
              />
            )}
          </div>

          <MeetingFooter
            status={recordingState}
            onClose={handleClose}
            onStart={() => start(title)}
            onPauseResume={pauseResume}
            onStop={handleStopRecording}
          />
        </div>
      </div>
    </>
  );
}
