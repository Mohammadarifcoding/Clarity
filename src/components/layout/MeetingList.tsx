"use client";

import React from "react";
import MeetingItem from "./MeetingItem";
import SidebarSkeleton from "./SidebarSkeleton";
import { Meeting } from "@prisma/client";

interface MeetingListProps {
  isLoading?: boolean;
  filteredMeetings: Meeting[];
  groupedMeetings: Record<string, Meeting[]>;
  selectedMeetingId?: string;
  onSelectMeeting?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function MeetingList({
  isLoading = true,
  filteredMeetings,
  groupedMeetings,
  selectedMeetingId,
  onSelectMeeting,
  onDelete,
}: MeetingListProps) {
  if (isLoading) {
    return <SidebarSkeleton />;
  }

  if (!isLoading && filteredMeetings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 mb-2">No meetings found</p>
        <p className="text-xs text-gray-400">
          Try creating or searching a different meeting
        </p>
      </div>
    );
  }

  const renderSection = (title: string, meetings: Meeting[]) => {
    if (!meetings.length) return null;

    return (
      <section className="mb-4 sm:mb-6">
        <h3 className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 sm:px-3 mb-1.5 sm:mb-2">
          {title}
        </h3>

        <div className="space-y-0.5 sm:space-y-1">
          {meetings.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              meeting={meeting}
              isSelected={meeting.id === selectedMeetingId}
              onSelect={onSelectMeeting}
              onDelete={onDelete}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-custom">
      {renderSection("Today", groupedMeetings.today)}
      {renderSection("Yesterday", groupedMeetings.yesterday)}
      {renderSection("This Week", groupedMeetings.thisWeek)}
      {renderSection("Older", groupedMeetings.older)}
    </div>
  );
}
