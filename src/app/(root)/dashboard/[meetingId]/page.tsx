"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getMeetingById } from "@/src/server/modules/meeting/meeting.action";
import { Meeting } from "@prisma/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import ChatInterface from "@/src/components/meeting/ChatInterface";

interface MeetingChatPageProps {
  onToggleSidebar?: () => void;
}

export default function MeetingChatPage({}: MeetingChatPageProps) {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.meetingId as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const data = await getMeetingById(meetingId);
        if (!data) {
          setError("Meeting not found");
          return;
        }
        setMeeting(data);
      } catch (err) {
        setError("Failed to load meeting");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (meetingId) {
      fetchMeeting();
    }
  }, [meetingId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-(--color-green) animate-spin" />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">{error || "Meeting not found"}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-(--color-charcoal) text-white rounded-lg hover:bg-(--color-green) transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="shrink-0 border-b border-gray-200 bg-white px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button - visible only on mobile */}
          <button
            onClick={() => router.push("/dashboard")}
            className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          {/* Desktop back button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg md:text-xl font-medium text-(--color-charcoal) truncate">
              {meeting.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {new Date(meeting.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface - Takes remaining space */}
      <div className="flex-1 min-h-0">
        <ChatInterface meetingId={meetingId} meeting={meeting} />
      </div>
    </div>
  );
}
