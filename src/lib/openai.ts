import OpenAI from "openai";

const openaiSdk = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default openaiSdk;
