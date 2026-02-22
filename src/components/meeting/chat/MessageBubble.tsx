"use client";

import { User, Bot } from "lucide-react";
import { formatTime } from "@/src/utils/chat.utils";
import type { Message } from "@/src/server/modules/chat/chat.types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "USER";

  return (
    <div
      className={`flex gap-2 sm:gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-green)/10 flex items-center justify-center shrink-0">
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-(--color-green)" />
        </div>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[80%] ${
          isUser
            ? "bg-(--color-green) text-white"
            : "bg-white border border-gray-200"
        } rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm`}
      >
        <p className="text-xs sm:text-sm whitespace-pre-wrap wrap-break-word">
          {message.content}
        </p>
        <p
          className={`text-[10px] sm:text-xs mt-1 ${
            isUser ? "text-white/70" : "text-gray-400"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
      {isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-charcoal) flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
      )}
    </div>
  );
}
