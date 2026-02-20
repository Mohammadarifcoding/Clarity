import { useRecording } from "@/src/hooks/useRecording";
import MeetingHeader from "./MeetingHeader";
import IdleState from "./states/IdleState";
import RecordingState from "./states/RecordingState";
import ProcessingState from "./states/ProcessingState";
import CompleteState from "./states/CompleteState";

export default function NewMeetingModal({
  isOpen,
  onClose,
  onMeetingCreated,
}: any) {
  const recording = useRecording(onMeetingCreated);

  if (!isOpen) return null;

  return (
    <div className="modal-wrapper">
      <div className="modal">
        <MeetingHeader
          title="Start New Meeting"
          onClose={() => {
            recording.reset();
            onClose();
          }}
        />

        {recording.state === "idle" && <IdleState onStart={recording.start} />}

        {["recording", "paused"].includes(recording.state) && (
          <RecordingState
            state={recording.state as "recording" | "paused"}
            time={recording.time}
            pause={recording.pause}
            stop={recording.stop}
            transcripts={[]}
          />
        )}

        {recording.state === "processing" && <ProcessingState />}

        {recording.state === "complete" && (
          <CompleteState duration={recording.time} />
        )}
      </div>
    </div>
  );
}
