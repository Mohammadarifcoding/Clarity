import { Pinecone } from "@pinecone-database/pinecone";

// Initialize a Pinecone client with your API key
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
export const vectorDb = pc.index({ name: "clarity" });
