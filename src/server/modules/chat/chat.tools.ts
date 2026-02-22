import { searchSimilarChunks } from "@/src/lib/vectorDb";

// Tool definition for searching meeting context
export const searchMeetingTool = {
  type: "function" as const,
  function: {
    name: "search_meeting_context",
    description:
      "Search for relevant information in the meeting transcript. Use this when the user asks about specific topics, decisions, or details discussed in the meeting.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to find relevant meeting content",
        },
      },
      required: ["query"],
    },
  },
};

// Execute the search tool
export const executeTool = async (
  toolName: string,
  args: Record<string, unknown>,
  meetingId: string,
): Promise<string> => {
  if (toolName === "search_meeting_context") {
    const query = args.query as string;
    const chunks = await searchSimilarChunks(meetingId, query);
    if (chunks.length === 0) {
      return "No relevant information found in the meeting transcript.";
    }
    return `Relevant meeting content:\n${chunks.map((chunk, i) => `${i + 1}. ${chunk}`).join("\n")}`;
  }
  return "Unknown tool";
};
