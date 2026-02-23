"use client";

import React, { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Circle, Clock, MoreVertical, Trash2, Loader2 } from "lucide-react";

import { formatTimeAgo, formatDuration } from "@/src/utils/meetingDate";
import { useOutsideClick } from "@/src/hooks/useOutsideClick";
import { Meeting } from "@prisma/client";

interface MeetingItemProps {
  meeting: Meeting;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function MeetingItem({
  meeting,
  isSelected = false,
  onSelect,
  onDelete,
}: MeetingItemProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useOutsideClick(menuRef, closeMenu);

  const handleSelect = () => {
    onSelect?.(meeting.id);
    router.push(`/dashboard/${meeting.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    onDelete?.(meeting.id);
    closeMenu();
  };

  return (
    <div className="relative group">
      <button
        onClick={handleSelect}
        className={`w-full text-left px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl transition-all relative
          focus:outline-none focus:ring focus:ring-(--color-green)/40
          ${isSelected ? "bg-(--color-green)/10" : "hover:bg-gray-50"}`}
      >
        {/* {meeting.hasUnreadInsights && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
        )} */}

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            {/* Title Row */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              {meeting.status === "RECORDING" && (
                <Circle className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500 fill-red-500 animate-pulse" />
              )}

              <span
                className={`text-xs sm:text-sm font-medium truncate ${
                  isSelected ? "text-(--color-green)" : "text-gray-800"
                }`}
              >
                {meeting.title}
              </span>

              {/* {meeting.hasTranscript && meeting.status === "COMPLETE" && (
                <Check className="w-3 h-3 text-green-500 shrink-0" />
              )} */}
            </div>

            {/* Meta Row */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
              <span>{formatTimeAgo(meeting.createdAt)}</span>

              {meeting.status === "COMPLETE" && (
                <>
                  <span>•</span>
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{formatDuration(meeting.audioDuration as number)}</span>
                </>
              )}

              {meeting.status === "RECORDING" && (
                <span className="text-red-500 font-medium">Recording…</span>
              )}

              {meeting.status === "PROCESSING" && (
                <span className="text-blue-500 font-medium flex items-center gap-1">
                  <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                  Processing...
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {meeting.status !== "RECORDING" && (
        <div
          ref={menuRef}
          className="absolute right-1.5 sm:right-2 top-2.5 sm:top-3 opacity-0 group-hover:opacity-100 transition"
        >
          <button
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-green)/40"
          >
            <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-1.5 sm:mt-2 w-32 sm:w-40 bg-white border border-gray-300 rounded-xl shadow-lg py-1 z-20"
            >
              <button
                role="menuitem"
                onClick={handleDelete}
                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-1.5 sm:gap-2"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
