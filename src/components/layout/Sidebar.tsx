/* eslint-disable react-hooks/static-components */
"use client";

import React, { useState, useRef } from "react";
import SidebarHeader from "./SidebarHeader";
import MeetingList from "./MeetingList";
import { useOutsideClick } from "@/src/hooks/useOutsideClick";
import { useMeetingFilter } from "@/src/hooks/useMeetingFilter";
import { Meeting } from "@prisma/client";

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
  const { filteredMeetings, groupedMeetings } = useMeetingFilter(
    meetings,
    searchQuery,
  );

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
