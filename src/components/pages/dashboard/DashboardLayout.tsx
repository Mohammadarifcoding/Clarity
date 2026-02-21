"use client";

import React, { useState } from "react";
import Sidebar from "@/src/components/layout/Sidebar";

import MeetingModal from "../../meeting/MeetingModal";
import FAKE_MEETINGS from "@/src/data/meeting";
import { Meeting } from "@prisma/client";

// Fake data for development

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<
    string | undefined
  >("2");
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>(FAKE_MEETINGS);

  const handleNewMeeting = (): void => {
    setIsNewMeetingModalOpen(true);
  };

  const handleSelectMeeting = (id: string) => {
    setSelectedMeetingId(id);
    console.log("Selected meeting:", id);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (selectedMeetingId === id) {
      setSelectedMeetingId(undefined);
    }
  };

  const handleMeetingCreated = (newMeeting: Meeting): void => {
    setMeetings((prev) => [newMeeting, ...prev]);
    setSelectedMeetingId(newMeeting.id);
    console.log("New meeting created:", newMeeting);
  };

  const handleCloseModal = () => {
    setIsNewMeetingModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[var(--color-gray-50)]">
      {/* Sidebar */}
      <Sidebar
        meetings={meetings}
        selectedMeetingId={selectedMeetingId}
        onNewMeeting={handleNewMeeting}
        onSelectMeeting={handleSelectMeeting}
        onDelete={handleDeleteMeeting}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">{children}</div>
      </main>

      {/* New Meeting Modal */}
      <MeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={handleCloseModal}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
}
