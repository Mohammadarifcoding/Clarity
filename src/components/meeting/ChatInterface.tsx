"use client";

import { useState } from "react";
import { useMessages } from "@/src/hooks/useMessages";
import { MessageList, ChatInput } from "@/src/components/meeting/chat";
import { Meeting } from "@prisma/client";

interface ChatInterfaceProps {
  meetingId: string;
  meeting: Meeting
}

export default function ChatInterface({ meetingId, meeting }: ChatInterfaceProps) {
  const { messages, isLoading, addMessage } = useMessages(meetingId);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (message: string) => {
    setIsSending(true);

    try {
      // Save user message to database
      await addMessage(message, "USER");

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, meetingId, meetingTitle: meeting.title, meetingNote: meeting.note }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.content) {
        setIsSending(false);
        await addMessage(data.content, "ASSISTANT");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Messages Area - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 scrollbar-custom">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          isSending={isSending}
        />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isSending} />
    </div>
  );
}
