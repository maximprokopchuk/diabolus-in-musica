"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReportErrorButtonProps {
  lessonSlug: string;
  topicSlug: string;
  pageUrl: string;
}

export function ReportErrorButton({
  lessonSlug,
  topicSlug,
  pageUrl,
}: ReportErrorButtonProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/error-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug, topicSlug, description, pageUrl }),
      });

      if (!res.ok) throw new Error();

      toast.success("Спасибо! Мы разберёмся с этим.");
      setDescription("");
      setOpen(false);
    } catch {
      toast.error("Не удалось отправить. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setDescription("");
    setOpen(false);
  }

  return (
    <div className="mt-2">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          Нашли ошибку?
        </button>
      ) : (
        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              Сообщить об ошибке
            </span>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите ошибку — неверный факт, опечатка, неточность..."
              maxLength={1000}
              rows={3}
              className="text-sm resize-none"
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !description.trim()}
              >
                {loading ? "Отправка..." : "Отправить"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
