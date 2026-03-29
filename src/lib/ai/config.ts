export const aiConfig = {
  provider: "openrouter" as const,
  model: process.env.AI_MODEL || "google/gemini-flash-1.5",
  baseUrl: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  maxTokens: 2048,
  temperature: 0.7,
};
