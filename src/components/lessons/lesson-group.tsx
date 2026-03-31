"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronDown } from "lucide-react";
import { LevelBadge, LEVEL_ORDER, type Level } from "@/components/lessons/level-badge";

const PHOTOS: Record<string, string[]> = {
  GENERAL: [
    "photo-1507838153414-b4b713384a76",
    "photo-1493225457124-a3eb161ffa5f",
    "photo-1511379938547-c1f69419868d",
    "photo-1514320291840-2e0a9bf2a9ae",
    "photo-1505740420928-5e560c06d30e",
  ],
  GUITAR: [
    "photo-1510915361894-db8b60106cb1",
    "photo-1525201548942-d8732f6617a0",
    "photo-1558618666-fcd25c85cd64",
    "photo-1564186763535-ebb21ef5277f",
    "photo-1517841905240-472988babdf9",
  ],
  BASS: [
    "photo-1516924962500-2b4b3b99ea02",
    "photo-1519892300165-cb5542fb47c7",
    "photo-1598488035139-bdbb2231ce04",
    "photo-1456513080510-7bf3a84b82f8",
    "photo-1511671782779-c97d3d27a1d4",
  ],
  DRUMS: [
    "photo-1524230659092-07f99a75c013",
    "photo-1519892300165-cb5542fb47c7",
    "photo-1461784121038-f088ca1e7714",
    "photo-1459749411175-04bf5292ceea",
    "photo-1470229538611-16ba8c7ffbd7",
  ],
  PIANO: [
    "photo-1520523839897-bd0b52f945a0",
    "photo-1551969014-7d2c4cddf0b6",
    "photo-1519683109079-d5f539e1542f",
    "photo-1488190211105-8b0e65b80b4e",
    "photo-1571019613454-1cb2f99b2d8b",
  ],
  UKULELE: [
    "photo-1510915361894-db8b60106cb1",
    "photo-1525201548942-d8732f6617a0",
    "photo-1507838153414-b4b713384a76",
    "photo-1493225457124-a3eb161ffa5f",
    "photo-1511379938547-c1f69419868d",
  ],
};

function getPhotoUrl(instrument: string, idx: number): string {
  const pool = PHOTOS[instrument] ?? PHOTOS.GENERAL;
  const photoId = pool[idx % pool.length];
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=400&q=60`;
}

type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  topics: {
    id: string;
    progress?: { completed: boolean }[] | null;
  }[];
};

export function LessonGroup({
  instrument,
  label,
  lessons,
  isLoggedIn,
  userLevel,
  defaultOpen = false,
}: {
  instrument: string;
  label: string;
  lessons: Lesson[];
  isLoggedIn: boolean;
  userLevel?: string | null;
  defaultOpen?: boolean;
}) {
  const storageKey = `lesson_section_open_${instrument}`;

  // Lazy init: read localStorage synchronously on first render (client-only) to avoid flicker
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return defaultOpen;
    const stored = localStorage.getItem(`lesson_section_open_${instrument}`);
    return stored !== null ? stored === "true" : defaultOpen;
  });

  // Sync if defaultOpen prop changes (e.g. preferredInstrument loaded async)
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === null) {
      setOpen(defaultOpen);
    }
  }, [instrument, defaultOpen, storageKey]);

  function toggle() {
    const next = !open;
    setOpen(next);
    localStorage.setItem(storageKey, String(next));
  }

  return (
    <section>
      <button
        onClick={toggle}
        className="flex items-center gap-3 w-full mb-5 text-left cursor-pointer"
      >
        <h2 className="text-lg font-semibold">{label}</h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">{lessons.length} уроков</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ease-in-out ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-250">
          {lessons.map((lesson, idx) => {
            const total = lesson.topics.length;
            const completed = isLoggedIn
              ? lesson.topics.filter((t) => t.progress?.some((p) => p.completed)).length
              : 0;
            const isDone = total > 0 && completed === total;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const photoUrl = getPhotoUrl(instrument, idx);

            const lessonLevelOrder = LEVEL_ORDER[lesson.level as Level] ?? 0;
            const userLevelOrder = userLevel ? (LEVEL_ORDER[userLevel as Level] ?? 0) : null;
            const isRelevant = userLevelOrder !== null && lessonLevelOrder >= userLevelOrder;
            const isBelowLevel = userLevelOrder !== null && lessonLevelOrder < userLevelOrder;

            return (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.slug}`}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${Math.min(idx * 60, 360)}ms` }}
              >
                <Card
                  className={`relative h-full overflow-hidden hover:border-primary/40 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group
                    ${isDone ? "border-green-500/40" : ""}
                    ${isRelevant && !isDone ? "border-l-2 border-l-primary/60" : ""}
                    ${isBelowLevel ? "opacity-60 grayscale-30 hover:opacity-90 hover:grayscale-0" : ""}
                  `}
                >
                  <Image
                    src={photoUrl}
                    alt=""
                    fill
                    className="object-cover opacity-[0.12] dark:opacity-[0.18] group-hover:opacity-[0.20] dark:group-hover:opacity-[0.28] transition-opacity duration-300"
                    sizes="400px"
                    aria-hidden
                  />
                  <CardHeader className="relative pb-2">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-3xl font-bold text-muted-foreground/20 group-hover:text-primary/20 transition-colors leading-none select-none">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <LevelBadge level={lesson.level} />
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {total}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-base leading-snug">{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="line-clamp-2 text-sm mb-3">
                      {lesson.description}
                    </CardDescription>
                    {isLoggedIn && total > 0 && (
                      isDone ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Урок пройден</span>
                      ) : completed > 0 ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{completed} / {total}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      ) : null
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
