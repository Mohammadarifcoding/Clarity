"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import MeetingList from "./MeetingList";
import { useMeetingFilter } from "@/src/hooks/useMeetingFilter";
import { Meeting } from "@prisma/client";

interface SidebarProps {
  meetings: Meeting[];
  isLoading?: boolean;
  selectedMeetingId?: string;
  onNewMeeting?: () => void;
  onSelectMeeting?: (id: string) => void;
  onDelete?: (id: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  meetings,
  isLoading = true,
  selectedMeetingId,
  onNewMeeting,
  onSelectMeeting,
  onDelete,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { filteredMeetings, groupedMeetings } = useMeetingFilter(
    meetings,
    searchQuery,
  );

  return (
    <>
      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <div className="text-lg font-medium text-(--color-charcoal) flex gap-2 items-center">
            <div className="w-7 h-7 bg-(--color-green) rounded-2xl flex items-center justify-center ">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            Clarity
          </div>
          <button
            onClick={onCloseMobile}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

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

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 xl:w-80 h-full bg-white border-r border-gray-200 shadow flex-col shrink-0">
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
    </>
  );
}
