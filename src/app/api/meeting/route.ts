import { createMeeting } from "@/src/server/modules/meeting/meeting.action";
import { CreateMeetingInput } from "@/src/server/modules/meeting/meeting.types";

export async function POST(params: { body: CreateMeetingInput }) {
  await createMeeting(params.body);
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
