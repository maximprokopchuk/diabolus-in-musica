import OpenAI from "openai";
import { aiConfig } from "./config";

const openai = new OpenAI({
  baseURL: aiConfig.baseUrl,
  apiKey: aiConfig.apiKey,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
    "X-Title": "Diabolus in Musica",
  },
});

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chat(messages: ChatMessage[]) {
  const response = await openai.chat.completions.create({
    model: aiConfig.model,
    messages,
    max_tokens: aiConfig.maxTokens,
    temperature: aiConfig.temperature,
  });

  return response.choices[0]?.message?.content || "";
}

export async function chatStream(messages: ChatMessage[]) {
  const response = await openai.chat.completions.create({
    model: aiConfig.model,
    messages,
    max_tokens: aiConfig.maxTokens,
    temperature: aiConfig.temperature,
    stream: true,
  });

  return response;
}
