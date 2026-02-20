export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO string
  duration: number; // in minutes
  status: "recording" | "processing" | "complete" | "failed";
  hasTranscript?: boolean;
  hasUnreadInsights?: boolean;
  aiSummary?: string;
  transcript?: string;
  participants?: number;
}
