/* eslint-disable react-hooks/static-components */
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Circle,
  Clock,
  MoreVertical,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import { Meeting } from "@/src/types/meeting";

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
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Meeting Item ---------------- */

  const MeetingItem = ({ meeting }: { meeting: Meeting }) => {
    const isSelected = meeting.id === selectedMeetingId;
    const isMenuOpen = menuOpenId === meeting.id;

    return (
      <div className="relative group">
        <button
          onClick={() => onSelectMeeting?.(meeting.id)}
          aria-selected={isSelected}
          className={`w-full text-left px-3 py-3 rounded-xl transition-all relative
            focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40
            ${isSelected ? "bg-[var(--color-green)]/10" : "hover:bg-gray-50"}`}
        >
          {/* Unread insights badge */}
          {meeting.hasUnreadInsights && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1">
                {meeting.status === "recording" && (
                  <Circle className="w-2 h-2 text-red-500 fill-red-500 animate-pulse" />
                )}
                <span
                  className={`text-sm font-medium truncate ${
                    isSelected ? "text-[var(--color-green)]" : "text-gray-800"
                  }`}
                >
                  {meeting.title}
                </span>

                {/* Transcript ready indicator */}
                {meeting.hasTranscript && meeting.status === "complete" && (
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>{formatTimeAgo(meeting.date)}</span>

                {meeting.status === "complete" && (
                  <>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(meeting.duration)}</span>
                  </>
                )}

                {meeting.status === "recording" && (
                  <span className="text-red-500 font-medium">Recording…</span>
                )}

                {meeting.status === "processing" && (
                  <span className="text-blue-500 font-medium flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing...
                  </span>
                )}
              </div>

              {/* AI Summary preview */}
              {meeting.aiSummary && meeting.status === "complete" && (
                <p className="text-xs text-gray-400 line-clamp-1 flex items-start gap-1">
                  <span className="flex-shrink-0">💡</span>
                  <span className="truncate">{meeting.aiSummary}</span>
                </p>
              )}
            </div>
          </div>
        </button>

        {meeting.status !== "recording" && (
          <div
            ref={menuRef}
            className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition"
          >
            <button
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(isMenuOpen ? null : meeting.id);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg py-1 z-20 animate-fade-in"
              >
                <button
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(meeting.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const CategorySection = ({
    title,
    meetings,
  }: {
    title: string;
    meetings: Meeting[];
  }) => {
    if (!meetings.length) return null;

    return (
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">
          {title}
        </h3>
        <div className="space-y-1">
          {meetings.map((meeting) => (
            <MeetingItem key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </section>
    );
  };

  /* ---------------- Skeleton Loader ---------------- */
  const SkeletonLoader = () => (
    <div className="space-y-3 px-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );

  /* ---------------- Render ---------------- */

  return (
    <aside className="w-[300px] h-full bg-white border-r border-gray-200 shadow flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-gray-200 ">
        <button
          onClick={onNewMeeting}
          className="w-full flex items-center justify-center gap-2 bg-[var(--color-green)] text-white py-2.5 rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40 transition hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          New Meeting
        </button>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            aria-label="Search meetings"
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm ring-2 ring-(--color-green)/40 border-none outline-none transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
        {isLoading ? (
          <SkeletonLoader />
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 mb-2">No meetings found</p>
            <p className="text-xs text-gray-400">
              {searchQuery
                ? "Try a different search term"
                : "Start by creating a new meeting"}
            </p>
          </div>
        ) : (
          <>
            <CategorySection title="Today" meetings={groupedMeetings.today} />
            <CategorySection
              title="Yesterday"
              meetings={groupedMeetings.yesterday}
            />
            <CategorySection
              title="This Week"
              meetings={groupedMeetings.thisWeek}
            />
            <CategorySection title="Older" meetings={groupedMeetings.older} />
          </>
        )}
      </div>
    </aside>
  );
}
