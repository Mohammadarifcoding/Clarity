// Format date to readable time
export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Auto-resize textarea based on content
export const autoResizeTextarea = (
  textarea: HTMLTextAreaElement | null,
  maxHeight: number = 120,
): void => {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
};

// Scroll to bottom of messages
export const scrollToBottom = (element: HTMLDivElement | null): void => {
  element?.scrollIntoView({ behavior: "smooth" });
};
