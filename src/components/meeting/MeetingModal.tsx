"use client";

import React, { useState } from "react";
import { MeetingForm } from "./MeetingForm";
import { RecordingView } from "./RecordingView";
import { StatusView } from "./StatusView";
import { formatTime } from "@/src/utils/formatTime";
import MeetingHeader from "./MeetingHeader";
import MeetingFooter from "./MeetingFooter";
import useRecording from "@/src/hooks/useRecording";
import {
  completeMeeting,
  createMeeting,
} from "@/src/server/modules/meeting/meeting.action";
import { saveTranscript } from "@/src/server/modules/transcription/transcription.action";
import toast from "react-hot-toast";
import { Meeting } from "@prisma/client";

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
    transcriptSegments,
    fullTranscript,
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
    stopRecording();
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

      const transcriptText = fullTranscript || liveTranscript.join(" ");
      if (transcriptText.trim()) {
        const transcriptResult = await saveTranscript({
          meetingId,
          fullText: transcriptText.trim(),
          segments: transcriptSegments.map((seg, index) => ({
            text: seg.text,
            startTime: seg.startTime,
            endTime: seg.endTime,
            sequenceNumber: index,
          })),
          wordCount: transcriptText.split(/\s+/).length,
          language: "en",
        });

        if (!transcriptResult.success) {
          console.error("Failed to save transcript:", transcriptResult.error);
          toast.error("Meeting saved but transcript failed to save");
        }
      }

      complete();

      const newMeeting: Meeting = {
        id: meetingId,
        title: title || `Meeting - ${new Date().toLocaleString()}`,
        audioDuration: recordingTime,
        status: "COMPLETE",
        endedAt: new Date(recordingData.endedAt),
        note,
        createdAt: new Date(),
        userId: "",
        startedAt: new Date(recordingData.endedAt),
        updatedAt: new Date(recordingData.endedAt),
      };

      onMeetingCreated?.(newMeeting);
      toast.success("Meeting completed and transcript saved!");
    } catch (err) {
      toast.error("Failed to complete meeting: " + err);
    }
    handleClose();
  };

  const handleClose = () => {
    if (
      (recordingState === "RECORDING" || recordingState === "paused") &&
      !window.confirm("Recording in progress... close?")
    )
      return;
    setNote("");
    reset();
    onClose();
  };

  const startMeeting = async () => {
    const data = {
      title: title || `Meeting - ${new Date().toLocaleString()}`,
      note,
    };
    try {
      const action = await createMeeting(data);
      if (action.success && action.data) {
        await startRecording(title, action.data.id);
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

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-175 flex flex-col animate-scale-in">
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

            {(recordingState === "RECORDING" ||
              recordingState === "paused") && (
              <RecordingView
                recordingState={recordingState}
                recordingTime={recordingTime}
                liveTranscript={liveTranscript}
                formatTime={formatTime}
              />
            )}

            {(recordingState === "PROCESSING" ||
              recordingState === "COMPLETE") && (
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
