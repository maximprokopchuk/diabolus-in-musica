"use client";

import { useState, useCallback } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function useChat(topicId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?topicId=${topicId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(
          data.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        );
      }
    } catch {
      // silently fail on history load
    }
  }, [topicId]);

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      setIsLoading(true);

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      };
      setMessages((prev) => [...prev, userMessage]);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId, message: content }),
        });

        if (!res.ok) {
          throw new Error("Ошибка отправки сообщения");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              fullContent += parsed.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: fullContent }
                    : m
                )
              );
            } catch {
              // skip unparseable chunks
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMessage.id)
        );
      } finally {
        setIsLoading(false);
      }
    },
    [topicId]
  );

  return { messages, isLoading, error, sendMessage, loadHistory };
}
