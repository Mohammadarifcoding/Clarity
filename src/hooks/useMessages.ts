"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getChatHistory,
  saveMessage,
} from "@/src/server/modules/chat/chat.action";
import type { Message } from "@/src/server/modules/chat/chat.types";

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  addMessage: (
    content: string,
    role: "USER" | "ASSISTANT",
  ) => Promise<Message | null>;
  refetch: () => Promise<void>;
}

export function useMessages(meetingId: string): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch messages from database
  const fetchMessages = useCallback(async () => {
    if (!meetingId) return;

    setIsLoading(true);
    setError(null);

    try {
      const history = await getChatHistory(meetingId);
      if (history.data) {
        setMessages(
          history.data.map((msg) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as "USER" | "ASSISTANT",
            createdAt: msg.createdAt,
          })),
        );
        setIsLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch messages"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [meetingId]);

  // Fetch on mount and when meetingId changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Add a new message to local state and save to database
  const addMessage = useCallback(
    async (
      content: string,
      role: "USER" | "ASSISTANT",
    ): Promise<Message | null> => {
      // Optimistic update - add to local state immediately
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        role,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, tempMessage]);

      // Save to database
      try {
        const result = await saveMessage(meetingId, content, role);
        if (result.success && result.data) {
          // Replace temp message with real one from database
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempMessage.id
                ? {
                    id: result.data!.id,
                    content: result.data!.content,
                    role: result.data!.role as "USER" | "ASSISTANT",
                    createdAt: result.data!.createdAt,
                  }
                : msg,
            ),
          );
          return {
            id: result.data.id,
            content: result.data.content,
            role: result.data.role as "USER" | "ASSISTANT",
            createdAt: result.data.createdAt,
          };
        }
        return null;
      } catch (err) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
        setError(
          err instanceof Error ? err : new Error("Failed to save message"),
        );
        return null;
      }
    },
    [meetingId],
  );

  return {
    messages,
    isLoading,
    error,
    addMessage,
    refetch: fetchMessages,
  };
}
