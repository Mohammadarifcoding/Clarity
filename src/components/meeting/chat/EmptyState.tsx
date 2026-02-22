"use client";

import { Bot } from "lucide-react";

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-(--color-green)/10 rounded-2xl flex items-center justify-center mb-4">
        <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-(--color-green)" />
      </div>
      <h2 className="text-lg sm:text-xl font-medium text-(--color-charcoal) mb-2">
        Start a conversation
      </h2>
      <p className="text-sm sm:text-base text-gray-500 max-w-md">
        Ask questions about this meeting, request summaries, or explore insights
        from the transcript.
      </p>
    </div>
  );
}
