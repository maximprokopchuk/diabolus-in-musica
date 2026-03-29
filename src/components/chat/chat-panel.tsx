"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatPanel({ topicId }: { topicId: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, loadHistory } = useChat(topicId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && session) {
      loadHistory();
    }
  }, [open, session, loadHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!session) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-xl z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          AI-ассистент
        </h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-8">
            Задайте вопрос по теме урока
          </p>
        )}
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-sm ${
                msg.role === "user"
                  ? "ml-8 bg-primary text-primary-foreground rounded-lg p-3"
                  : "mr-8 bg-muted rounded-lg p-3"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content || "..."}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="mr-8 bg-muted rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-sm text-muted-foreground">Думаю...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {error && (
        <p className="text-xs text-destructive px-3 pb-1">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ваш вопрос..."
          className="min-h-[40px] max-h-[100px] resize-none text-sm"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
