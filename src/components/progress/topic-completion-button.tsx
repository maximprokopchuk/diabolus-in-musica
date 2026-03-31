"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export function TopicCompletionButton({
  topicId,
  initialCompleted,
}: {
  topicId: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  async function toggleComplete() {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, completed: !completed }),
      });
      if (res.ok) {
        const next = !completed;
        setCompleted(next);
        if (next) {
          celebrate();
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function celebrate() {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);

    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x, y },
      colors: ["#b91c1c", "#dc2626", "#f59e0b", "#10b981", "#3b82f6"],
      scalar: 0.9,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { x, y: y - 0.05 },
        colors: ["#fbbf24", "#34d399", "#818cf8"],
        scalar: 0.7,
      });
    }, 200);
  }

  return (
    <Button
      ref={btnRef}
      variant={completed ? "default" : "outline"}
      onClick={toggleComplete}
      disabled={loading}
      className={`gap-2 transition-all duration-300 ${celebrating ? "scale-110 shadow-lg shadow-primary/30" : ""}`}
    >
      {celebrating ? (
        <Sparkles className="h-4 w-4 animate-pulse" />
      ) : completed ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {celebrating ? "Отлично!" : completed ? "Пройдено" : "Отметить как пройденное"}
    </Button>
  );
}
