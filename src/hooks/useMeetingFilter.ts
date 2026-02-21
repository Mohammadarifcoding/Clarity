import { useMemo } from "react";

import { categorizeMeeting } from "../utils/meetingDate";
import { Meeting } from "@prisma/client";

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
      const category = categorizeMeeting(meeting.createdAt.toISOString());
      groups[category].push(meeting);
    });

    return groups;
  }, [filteredMeetings]);

  return { filteredMeetings, groupedMeetings };
};
