"use client";
import Sidebar from "@/src/components/layout/Sidebar";


export default function Dashboard() {
  return (
    <Sidebar
      onSelectMeeting={(id) => console.log("select", id)}
    />
  );
}

