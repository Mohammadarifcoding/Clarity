import { Pinecone } from "@pinecone-database/pinecone";

// Initialize a Pinecone client with your API key
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index("clarity");

// Search similar chunks in the vector database for a specific meeting
export const searchSimilarChunks = async (
  meetingId: string,
  query: string,
  topK: number = 5,
): Promise<string[]> => {
  try {
    const namespace = index.namespace(meetingId);

    const results = await namespace.searchRecords({
      query: {
        topK,
        inputs: { text: query },
      },
    });

    // Extract the chunk texts from the results
    const chunks = results.result.hits.map(
      (hit) => (hit.fields as Record<string, string>).meeting_text,
    );

    return chunks;
  } catch (error) {
    console.error("Error searching vector database:", error);
    return [];
  }
};


export { index as vectorDb };
