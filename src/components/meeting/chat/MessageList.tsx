"use client";

import { useRef, useEffect } from "react";
import { scrollToBottom } from "@/src/utils/chat.utils";
import type { Message } from "@/src/server/modules/chat/chat.types";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
}

export function MessageList({
  messages,
  isLoading,
  isSending,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(messagesEndRef.current);
  }, [messages]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (messages.length === 0 && !isSending) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 pb-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isSending && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
