"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";

export function TopicCompletionButton({
  topicId,
  initialCompleted,
}: {
  topicId: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function toggleComplete() {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, completed: !completed }),
      });
      if (res.ok) {
        setCompleted(!completed);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={completed ? "default" : "outline"}
      onClick={toggleComplete}
      disabled={loading}
      className="gap-2"
    >
      {completed ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {completed ? "Пройдено" : "Отметить как пройденное"}
    </Button>
  );
}
