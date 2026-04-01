"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronDown } from "lucide-react";
import { LevelBadge, LEVEL_ORDER, type Level } from "@/components/lessons/level-badge";

const PHOTOS: Record<string, string[]> = {
  GENERAL: [
    "photo-1507838153414-b4b713384a76","photo-1493225457124-a3eb161ffa5f","photo-1511379938547-c1f69419868d",
    "photo-1514320291840-2e0a9bf2a9ae","photo-1505740420928-5e560c06d30e","photo-1487180144351-b8472da7d491",
    "photo-1415201364774-f6f0bb35f28f","photo-1471478331149-c72f17e33c73","photo-1470225620780-dba8ba36b745",
    "photo-1468164016595-6108e4c60c8b","photo-1483412033650-1015ddeb83d1","photo-1528489469914-0c3f5e9a8f8b",
    "photo-1496293455970-f8581aae0e3b","photo-1524650359799-842906ca1c06","photo-1519677584237-752f8853252e",
  ],
  GUITAR: [
    "photo-1510915361894-db8b60106cb1","photo-1525201548942-d8732f6617a0","photo-1558618666-fcd25c85cd64",
    "photo-1564186763535-ebb21ef5277f","photo-1517841905240-472988babdf9","photo-1541689592655-f5f52825a3b8",
    "photo-1456513080510-7bf3a84b82f8","photo-1470229722913-7c0e2dbbafd3","photo-1542652694-40abf526446e",
    "photo-1516924962500-2b4b3b99ea02","photo-1462965326201-d02e4f455804","photo-1519508234439-4f23643125c1",
    "photo-1495653797063-114787b77b23","photo-1453090927415-5f45085b65c0","photo-1529518969858-8baa65152fc8",
  ],
  BASS: [
    "photo-1516924962500-2b4b3b99ea02","photo-1519892300165-cb5542fb47c7","photo-1598488035139-bdbb2231ce04",
    "photo-1456513080510-7bf3a84b82f8","photo-1511671782779-c97d3d27a1d4","photo-1525201548942-d8732f6617a0",
    "photo-1510915361894-db8b60106cb1","photo-1526478806334-5fd488fcaabc","photo-1507838153414-b4b713384a76",
    "photo-1574169208507-84376144848b","photo-1470229722913-7c0e2dbbafd3","photo-1564186763535-ebb21ef5277f",
    "photo-1460723237483-7a6dc9d0b212","photo-1513883049090-d0b7439799bf","photo-1493225457124-a3eb161ffa5f",
  ],
  DRUMS: [
    "photo-1524230659092-07f99a75c013","photo-1461784121038-f088ca1e7714","photo-1459749411175-04bf5292ceea",
    "photo-1470229538611-16ba8c7ffbd7","photo-1519892300165-cb5542fb47c7","photo-1519683109079-d5f539e1542f",
    "photo-1511379938547-c1f69419868d","photo-1536902066851-5b8da52c5c7c","photo-1415201364774-f6f0bb35f28f",
    "photo-1471478331149-c72f17e33c73","photo-1493225457124-a3eb161ffa5f","photo-1514320291840-2e0a9bf2a9ae",
    "photo-1506157786151-b8491531f063","photo-1487180144351-b8472da7d491","photo-1470225620780-dba8ba36b745",
  ],
  PIANO: [
    "photo-1520523839897-bd0b52f945a0","photo-1551969014-7d2c4cddf0b6","photo-1519683109079-d5f539e1542f",
    "photo-1488190211105-8b0e65b80b4e","photo-1571019613454-1cb2f99b2d8b","photo-1468164016595-6108e4c60c8b",
    "photo-1483412033650-1015ddeb83d1","photo-1507838153414-b4b713384a76","photo-1524650359799-842906ca1c06",
    "photo-1489599849927-2ee91cede3ba","photo-1505740420928-5e560c06d30e","photo-1514320291840-2e0a9bf2a9ae",
    "photo-1493225457124-a3eb161ffa5f","photo-1519677584237-752f8853252e","photo-1496293455970-f8581aae0e3b",
  ],
  UKULELE: [
    "photo-1507838153414-b4b713384a76","photo-1525201548942-d8732f6617a0","photo-1510915361894-db8b60106cb1",
    "photo-1511379938547-c1f69419868d","photo-1493225457124-a3eb161ffa5f","photo-1517841905240-472988babdf9",
    "photo-1558618666-fcd25c85cd64","photo-1505740420928-5e560c06d30e","photo-1514320291840-2e0a9bf2a9ae",
    "photo-1487180144351-b8472da7d491","photo-1541689592655-f5f52825a3b8","photo-1470229722913-7c0e2dbbafd3",
    "photo-1468164016595-6108e4c60c8b","photo-1456513080510-7bf3a84b82f8","photo-1519892300165-cb5542fb47c7",
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
                <div
                  className={`relative flex flex-col min-h-[200px] rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group
                    shadow-sm hover:-translate-y-1 hover:shadow-[0_6px_24px_-4px_oklch(0_0_0/0.12)] dark:hover:shadow-[0_6px_24px_-4px_oklch(0_0_0/0.5)] active:scale-[0.99]
                    ${isDone ? "border-green-500/40 hover:border-green-500/60 dark:border-green-500/30 dark:hover:border-green-500/50" : "border-border hover:border-primary/40 dark:hover:border-primary/50"}
                    ${isBelowLevel ? "opacity-60 hover:opacity-95" : ""}
                  `}
                >
                  {/* Background image — more vivid in light mode, subtler in dark */}
                  <Image
                    src={photoUrl}
                    alt=""
                    fill
                    className="object-cover opacity-45 dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                    sizes="400px"
                    aria-hidden
                  />
                  {/* Gradient overlay: light mode fades card bg (white) at bottom for legibility */}
                  <div className="absolute inset-0 bg-linear-to-b from-card/5 via-card/50 to-card/95 dark:from-background/10 dark:via-background/45 dark:to-background/88" />
                  {/* Left accent for relevant level */}
                  {isRelevant && !isDone && (
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary/70" />
                  )}

                  {/* Content */}
                  <div className="relative flex flex-col flex-1 p-5 gap-3">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-4xl font-black text-foreground/10 dark:text-foreground/20 group-hover:text-primary/15 dark:group-hover:text-primary/25 transition-colors leading-none select-none tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-2 pt-1">
                        <LevelBadge level={lesson.level} />
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <span className="text-xs text-muted-foreground dark:text-white/50 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {total}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title + description */}
                    <div className="flex-1">
                      <p className="font-semibold text-base leading-snug mb-1.5 text-foreground dark:text-white">{lesson.title}</p>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground dark:text-white/60 line-clamp-2 leading-relaxed">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    {/* Progress */}
                    {isLoggedIn && total > 0 && (
                      isDone ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Урок пройден</span>
                      ) : completed > 0 ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{completed} / {total}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
