"use client";

import React, { useState } from "react";
import Sidebar from "@/src/components/layout/Sidebar";
import { Meeting } from "@/src/types/meeting";

// Fake data for development
const FAKE_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "Team Standup",
    date: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    duration: 15,
    status: "recording",
    hasTranscript: false,
  },
  {
    id: "2",
    title: "Marketing Strategy Discussion",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    status: "complete",
    hasTranscript: true,
    aiSummary: "3 action items • Budget allocation • Q2 planning",
  },
  {
    id: "3",
    title: "Client Call - Acme Corp",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    duration: 83,
    status: "complete",
    hasTranscript: true,
    aiSummary: "Contract terms • Next steps defined • Follow-up needed",
  },
  {
    id: "4",
    title: "Product Roadmap Planning",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration: 62,
    status: "complete",
    hasTranscript: true,
    hasUnreadInsights: true,
    aiSummary: "5 key decisions • Timeline set • Resources allocated",
  },
  {
    id: "5",
    title: "Design Review Session",
    date: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    duration: 38,
    status: "complete",
    hasTranscript: true,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<
    string | undefined
  >("2");
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);

  const handleNewMeeting = () => {
    setIsNewMeetingModalOpen(true);
    console.log("Opening new meeting modal");
  };

  const handleSelectMeeting = (id: string) => {
    setSelectedMeetingId(id);
    console.log("Selected meeting:", id);
  };

  const handleDeleteMeeting = (id: string) => {
    console.log("Delete meeting:", id);
    // TODO: Implement delete logic
  };

  return (
    <div className="flex h-screen  bg-[var(--color-gray-50)]">
      {/* Sidebar */}
      <Sidebar
        meetings={FAKE_MEETINGS}
        selectedMeetingId={selectedMeetingId}
        onNewMeeting={handleNewMeeting}
        onSelectMeeting={handleSelectMeeting}
        onDelete={handleDeleteMeeting}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
