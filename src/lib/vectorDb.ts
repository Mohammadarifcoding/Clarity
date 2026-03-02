import { Pinecone } from "@pinecone-database/pinecone";

// Initialize a Pinecone client with your API key
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index("clarity");

type MeetingChunk = {
  meeting_text: string;
  start_time: number;
  end_time: number;
};

// Search similar chunks in the vector database for a specific meeting
export const searchSimilarChunks = async (
  meetingId: string,
  query: string,
  topK: number = 5,
): Promise<MeetingChunk[]> => {
  try {
    const namespace = index.namespace(meetingId);

    const results = await namespace.searchRecords({
      query: {
        topK,
        inputs: { text: query },
      },
    });

    const chunks = results.result.hits.map((hit) => ({
      meeting_text: (hit.fields as Record<string, string>).meeting_text,
      start_time: (hit.fields as Record<string, number>).start_time,
      end_time: (hit.fields as Record<string, number>).end_time,
    }));

    return chunks;
  } catch (error) {
    console.error("Error searching vector database:", error);
    return [];
  }
};

export { index as vectorDb };
