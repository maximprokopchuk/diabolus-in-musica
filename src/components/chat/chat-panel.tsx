"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, X, Loader2, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTED = [
  "Объясни эту тему простыми словами",
  "Дай конспект по теме",
  "Как применить это на практике?",
  "Какие типичные ошибки делают новички?",
];

export function ChatPanel({ lessonSlug, topicSlug }: { lessonSlug: string; topicSlug: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, loadHistory } = useChat(lessonSlug, topicSlug);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && session) {
      loadHistory();
      setTimeout(() => textareaRef.current?.focus(), 100);
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

  function handleSuggestion(s: string) {
    sendMessage(s);
  }

  const showSuggestions = messages.length === 0 && !isLoading;

  // Closed state — floating button
  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        aria-label="Открыть AI-ассистент"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  // Panel — full-width bottom sheet on mobile, fixed card on desktop
  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <Card
        className={`
          fixed z-50 flex flex-col shadow-2xl
          /* mobile: bottom sheet */
          bottom-0 left-0 right-0 rounded-b-none rounded-t-2xl max-h-[80vh]
          /* desktop: floating card */
          sm:bottom-6 sm:right-6 sm:left-auto sm:w-96 sm:h-[520px] sm:max-h-none sm:rounded-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b shrink-0">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            AI-ассистент
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setOpen(false)}
            aria-label="Закрыть чат"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3" ref={scrollRef}>
          {showSuggestions && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2 text-center">Задайте вопрос по теме урока</p>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
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
        </div>

        {/* Error */}
        {error && (
          <div className="px-3 pb-1 flex items-center gap-2">
            <p className="text-xs text-destructive flex-1">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs gap-1"
              onClick={() => input && sendMessage(input)}
            >
              <RefreshCw className="h-3 w-3" /> Повторить
            </Button>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2 shrink-0">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ваш вопрос..."
            className="min-h-[40px] max-h-[100px] resize-none text-sm"
            rows={1}
            aria-label="Введите вопрос по теме урока"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Отправить">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </>
  );
}
