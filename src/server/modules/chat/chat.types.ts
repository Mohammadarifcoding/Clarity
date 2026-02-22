// Chat message types
export interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  createdAt: Date;
}

// API response type
export interface ChatApiResponse {
  content?: string;
  error?: string;
}

// Response wrapper type
export type ResponseType<T> = {
  success: boolean;
  data: T | null;
  error: Error | null;
};
