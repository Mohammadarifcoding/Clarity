"use client";

import { Bot, Loader2 } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3 justify-start">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-green)/10 flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-(--color-green)" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-(--color-green) animate-spin" />
          <span className="text-xs sm:text-sm text-gray-500">Thinking...</span>
        </div>
      </div>
    </div>
  );
}
