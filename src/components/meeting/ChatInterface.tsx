"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, User, Bot } from "lucide-react";
import {
  sendMessage,
  getChatHistory,
} from "@/src/server/modules/chat/chat.action";

interface ChatInterfaceProps {
  meetingId: string;
}

interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  createdAt: Date;
  tokensUsed?: number | null;
}

export default function ChatInterface({ meetingId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getChatHistory(meetingId);
        if (history) {
          setMessages(
            history.map((msg) => ({
              ...msg,
              role: msg.role as "USER" | "ASSISTANT",
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [meetingId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = "auto";
    // Set height based on content (with max height handled by CSS)
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isSending) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content: trimmedMessage,
      createdAt: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setIsSending(true);

    try {
      // Send message to server and get response
      const response = await sendMessage({
        meetingId,
        content: trimmedMessage,
      });

      if (response.success && response.data) {
        // Replace temp message with real one and add assistant response
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== userMessage.id),
          response.data!.userMessage as Message,
          response.data!.assistantMessage as Message,
        ]);
      } else {
        // If there's an error, still show the user message
        console.error("Failed to send message:", response.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Messages Area - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 scrollbar-custom">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-(--color-green) animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-(--color-green)/10 rounded-2xl flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-(--color-green)" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-(--color-charcoal) mb-2">
              Start a conversation
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-md">
              Ask questions about this meeting, request summaries, or explore
              insights from the transcript.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${
                  message.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "ASSISTANT" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-green)/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-(--color-green)" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] ${
                    message.role === "USER"
                      ? "bg-(--color-green) text-white"
                      : "bg-white border border-gray-200"
                  } rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap wrap-break-word">
                    {message.content}
                  </p>
                  <p
                    className={`text-[10px] sm:text-xs mt-1 ${
                      message.role === "USER"
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
                {message.role === "USER" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-charcoal) flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-green)/10 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-(--color-green)" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-(--color-green) animate-spin" />
                    <span className="text-xs sm:text-sm text-gray-500">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Input Area */}
      <div className="shrink-0 border-t border-gray-200 bg-white p-3 sm:p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 sm:gap-3 bg-gray-100 rounded-2xl p-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isSending}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none px-2 sm:px-3 py-2 text-xs sm:text-sm text-(--color-charcoal) placeholder-gray-400 max-h-30 scrollbar-custom disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              className="p-2.5 sm:p-3 bg-(--color-green) text-white rounded-xl hover:bg-(--color-green-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 hidden sm:block">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
