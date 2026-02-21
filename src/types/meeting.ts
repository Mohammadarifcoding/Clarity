export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO string
  duration: number; // in minutes
  status: "RECORDING" | "PROCESSING" | "COMPLETE" | "failed";
  hasTranscript?: boolean;
  hasUnreadInsights?: boolean;
  aiSummary?: string;
  transcript?: string;
  participants?: number;
  note?: string;
  endedAt?: string; // ISO string
}
