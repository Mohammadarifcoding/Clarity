"use client";

import { useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { autoResizeTextarea } from "@/src/utils/chat.utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    autoResizeTextarea(inputRef.current);
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setInputValue("");

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.focus();
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center bg-gray-100 rounded-2xl px-3 py-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            // disabled={disabled}
            rows={1}
            className="
  flex-1
  bg-transparent
  outline-none
  resize-none
  text-sm
  text-gray-800
  placeholder-gray-400
  leading-5
  min-h-6
  max-h-40
  overflow-y-auto
"
          />

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
            className="
            ml-2
            p-2.5
            bg-green-600
            text-white
            rounded-xl
            hover:bg-green-700
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            shrink-0
          "
          >
            {disabled ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2 hidden sm:block">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
