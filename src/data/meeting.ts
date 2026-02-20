import { Meeting } from "../types/meeting";

export const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Team Standup",
    date: new Date().toISOString(),
    duration: 15,
    status: "complete",
  },
];
