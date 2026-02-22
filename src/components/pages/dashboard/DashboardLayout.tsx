"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "@/src/components/layout/Sidebar";

import MeetingModal from "../../meeting/MeetingModal";
import { Meeting } from "@prisma/client";
import { useMeetings } from "@/src/hooks/useMeetingList";
import { deleteMeeting } from "@/src/server/modules/meeting/meeting.action";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { meetings, loading, refetch } = useMeetings();

  // Extract meetingId from URL path
  const getSelectedMeetingId = (): string | undefined => {
    const match = pathname?.match(/\/dashboard\/([^/]+)/);
    return match ? match[1] : undefined;
  };

  const selectedMeetingId = getSelectedMeetingId();

  const handleNewMeeting = (): void => {
    setIsNewMeetingModalOpen(true);
    setIsSidebarOpen(false);
  };

  const handleSelectMeeting = (id: string) => {
    // Navigation is handled in MeetingItem component
    console.log("Selected meeting:", id);
    setIsSidebarOpen(false);
  };

  const handleDeleteMeeting = async (id: string) => {
    await deleteMeeting(id);
    refetch();
  };

  const handleMeetingCreated = (newMeeting: Meeting): void => {
    refetch();
    console.log("New meeting created:", newMeeting);
  };

  const handleCloseModal = () => {
    setIsNewMeetingModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isLoading={loading}
        meetings={meetings}
        selectedMeetingId={selectedMeetingId}
        onNewMeeting={handleNewMeeting}
        onSelectMeeting={handleSelectMeeting}
        onDelete={handleDeleteMeeting}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {/* Mobile Header Only show on dashboard home */}
        {!selectedMeetingId && (
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-medium text-(--color-charcoal)">
              Clarity
            </h1>
          </div>
        )}
        <div className="h-full overflow-y-auto">{children}</div>
      </main>

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={handleCloseModal}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
}
