import { Plus, Search } from "lucide-react";
import React from "react";

const SidebarHeader = ({
  searchQuery,
  setSearchQuery,
  onNewMeeting,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onNewMeeting: () => void;
}) => {
  return (
    <div className="p-5 border-b border-gray-200 ">
      <button
        onClick={onNewMeeting}
        className="w-full flex items-center justify-center gap-2 bg-(--color-green) text-white py-2.5 rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--color-green)/40 transition hover:scale-105"
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
  );
};

export default SidebarHeader;
