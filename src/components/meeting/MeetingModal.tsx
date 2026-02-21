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
import {
  completeMeeting,
  createMeeting,
} from "@/src/server/modules/meeting/meeting.action";
import toast from "react-hot-toast";

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
    startRecording,
    pauseResumeAudio,
    stopRecording,
    complete,
    meetingId,
    reset,
  } = useRecording();

  const [note, setNote] = useState("");

  // Stop & complete meeting
  const handleStopRecording = async () => {
    stopRecording(); // stop audio + timer
    try {
      if (!meetingId) throw new Error("No meeting ID found");

      const recordingData = {
        meetingId,
        audioDuration: recordingTime,
        endedAt: new Date().toISOString(),
      };

      const action = await completeMeeting(recordingData);
      if (!action.success || !action.data)
        throw new Error("Failed to complete meeting: " + action.error);

      complete(); // set state -> complete

      const newMeeting: Meeting = {
        id: meetingId,
        title: title || `Meeting - ${new Date().toLocaleString()}`,
        duration: recordingTime,
        status: "complete",
        transcript: liveTranscript.join("\n"),
        endedAt: recordingData.endedAt,
        hasTranscript: liveTranscript.length > 0,
        note,
        date: new Date().toISOString(),
      };

      onMeetingCreated?.(newMeeting);
    } catch (err) {
      toast.error("Failed to complete meeting: " + err);
    }
    handleClose();
  };

  // Close modal safely
  const handleClose = () => {
    if (
      (recordingState === "recording" || recordingState === "paused") &&
      !window.confirm("Recording in progress... close?")
    )
      return;
    setNote("");
    reset();
    onClose();
  };

  // Start meeting: create backend meeting + start recording
  const startMeeting = async () => {
    const data = {
      title: title || `Meeting - ${new Date().toLocaleString()}`,
      note,
    };
    try {
      const action = await createMeeting(data);
      if (action.success && action.data) {
        await startRecording(title, action.data.id); // mic + timer + transcript
      } else {
        toast.error("Failed to create meeting: " + action.error);
      }
    } catch (error) {
      toast.error("Failed to create meeting: " + error);
    }
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-175 flex flex-col animate-scale-in">
          <MeetingHeader status={recordingState} onClose={handleClose} />

          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {recordingState === "idle" && (
              <MeetingForm
                title={title}
                setTitle={setTitle}
                note={note}
                setNote={setNote}
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
            onStart={startMeeting}
            onPauseResume={pauseResumeAudio}
            onStop={handleStopRecording}
          />
        </div>
      </div>
    </>
  );
}
