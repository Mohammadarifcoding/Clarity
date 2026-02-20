import { useMemo } from "react";
import { Meeting } from "@/src/types/meeting";
import { categorizeMeeting } from "../utils/meetingDate";

export const useMeetingFilter = (meetings: Meeting[], searchQuery: string) => {
  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [meetings, searchQuery]);

  const groupedMeetings = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    } as Record<string, Meeting[]>;

    filteredMeetings.forEach((meeting) => {
      const category = categorizeMeeting(meeting.date);
      groups[category].push(meeting);
    });

    return groups;
  }, [filteredMeetings]);

  return { filteredMeetings, groupedMeetings };
};
