"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LEVEL_OPTIONS = [
  { id: "all", label: "Все уровни" },
  { id: "beginner", label: "Базовый" },
  { id: "intermediate", label: "Средний" },
  { id: "advanced", label: "Продвинутый" },
];

export function ProgressLevelFilter({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function handleChange(level: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (level === "all") {
      params.delete("level");
    } else {
      params.set("level", level);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap mb-8">
      {LEVEL_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handleChange(opt.id)}
          disabled={pending}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer ${
            active === opt.id
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "border-border bg-card text-foreground/60 hover:border-primary/40 hover:text-foreground hover:bg-card"
          } ${pending ? "opacity-60 cursor-wait" : ""}`}
        >
          {opt.label}
        </button>
      ))}
      {pending && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-in fade-in duration-200">
          <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block" />
          Загрузка...
        </span>
      )}
    </div>
  );
}
