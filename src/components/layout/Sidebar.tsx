/* eslint-disable react-hooks/static-components */
"use client";

import React, { useMemo, useState, useRef } from "react";
import { Meeting } from "@/src/types/meeting";
import SidebarHeader from "./SidebarHeader";
import MeetingList from "./MeetingList";
import { useOutsideClick } from "@/src/hooks/useOutsideClick";

interface SidebarProps {
  meetings: Meeting[];
  isLoading?: boolean;
  selectedMeetingId?: string;
  onNewMeeting?: () => void;
  onSelectMeeting?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function Sidebar({
  meetings,
  isLoading = false,
  selectedMeetingId,
  onNewMeeting,
  onSelectMeeting,
  onDelete,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ---------------- Helpers ---------------- */

  const categorizeMeeting = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return "thisWeek";
    return "older";
  };

  /* ---------------- Derived ---------------- */

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [meetings, searchQuery]);

  const groupedMeetings = useMemo(() => {
    const groups: Record<string, Meeting[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    filteredMeetings.forEach((meeting) => {
      const category = categorizeMeeting(meeting.date);
      groups[category].push(meeting);
    });

    return groups;
  }, [filteredMeetings]);

  /* ---------------- Outside Click ---------------- */

  useOutsideClick(menuRef, () => {
    setMenuOpenId(null);
  });

  return (
    <aside className="w-75 h-full bg-white border-r border-gray-200 shadow flex flex-col shrink-0">
      <SidebarHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewMeeting={onNewMeeting || (() => {})}
      />

      <MeetingList
        isLoading={isLoading}
        filteredMeetings={filteredMeetings}
        groupedMeetings={groupedMeetings}
        selectedMeetingId={selectedMeetingId}
        onSelectMeeting={onSelectMeeting}
        onDelete={onDelete}
      />
    </aside>
  );
}
