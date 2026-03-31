"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { LessonGroup } from "@/components/lessons/lesson-group";
import { LessonsSearch } from "@/components/lessons/lessons-search";
import { LevelBadge } from "@/components/lessons/level-badge";
import { LessonsSkeleton } from "@/components/lessons/lessons-skeleton";

const instrumentOrder = ["GENERAL", "GUITAR", "BASS", "DRUMS", "PIANO", "UKULELE"];
const instrumentLabels: Record<string, string> = {
  GUITAR: "Гитара",
  BASS: "Бас-гитара",
  PIANO: "Фортепиано",
  UKULELE: "Укулеле",
  DRUMS: "Барабаны",
  GENERAL: "Общая теория",
};

const LEVEL_OPTIONS = [
  { id: "all", label: "Все уровни" },
  { id: "beginner", label: "Базовый" },
  { id: "intermediate", label: "Средний" },
  { id: "advanced", label: "Продвинутый" },
];

const PHOTOS: Record<string, string[]> = {
  GENERAL: ["photo-1507838153414-b4b713384a76","photo-1493225457124-a3eb161ffa5f","photo-1511379938547-c1f69419868d","photo-1514320291840-2e0a9bf2a9ae","photo-1505740420928-5e560c06d30e"],
  GUITAR: ["photo-1510915361894-db8b60106cb1","photo-1525201548942-d8732f6617a0","photo-1558618666-fcd25c85cd64","photo-1564186763535-ebb21ef5277f","photo-1517841905240-472988babdf9"],
  BASS: ["photo-1516924962500-2b4b3b99ea02","photo-1519892300165-cb5542fb47c7","photo-1598488035139-bdbb2231ce04","photo-1456513080510-7bf3a84b82f8","photo-1511671782779-c97d3d27a1d4"],
  DRUMS: ["photo-1524230659092-07f99a75c013","photo-1461784121038-f088ca1e7714","photo-1459749411175-04bf5292ceea","photo-1470229538611-16ba8c7ffbd7","photo-1519892300165-cb5542fb47c7"],
  PIANO: ["photo-1520523839897-bd0b52f945a0","photo-1551969014-7d2c4cddf0b6","photo-1519683109079-d5f539e1542f","photo-1488190211105-8b0e65b80b4e","photo-1571019613454-1cb2f99b2d8b"],
  UKULELE: ["photo-1507838153414-b4b713384a76","photo-1525201548942-d8732f6617a0","photo-1510915361894-db8b60106cb1","photo-1511379938547-c1f69419868d","photo-1493225457124-a3eb161ffa5f"],
};

function getPhotoUrl(instrument: string, idx: number) {
  const pool = PHOTOS[instrument] ?? PHOTOS.GENERAL;
  return `https://images.unsplash.com/${pool[idx % pool.length]}?auto=format&fit=crop&w=400&q=60`;
}

type Lesson = {
  id: string; slug: string; title: string; description: string | null;
  instrument: string; order: number; level: string;
  topics: { id: string; progress?: { completed: boolean }[] | null }[];
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [preferredInstrument, setPreferredInstrument] = useState<string | null>(null);
  const [preferredLevel, setPreferredLevel] = useState<string | null>(null);
  // activeLevel is the current filter — initialized from preferredLevel once loaded
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [query, setQuery] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    fetch("/api/lessons")
      .then((r) => r.json())
      .then((data) => {
        setLessons(data.lessons ?? []);
        setIsLoggedIn(data.isLoggedIn ?? false);
        setPreferredInstrument(data.preferredInstrument ?? null);
        const lvl = data.preferredLevel ?? null;
        setPreferredLevel(lvl);
        if (lvl) setActiveLevel(lvl);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLevelChange(level: string) {
    setActiveLevel(level);
    if (isLoggedIn) {
      fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredLevel: level === "all" ? null : level }),
      });
    }
  }

  // Filter by level then by search query
  const levelFiltered = activeLevel === "all"
    ? lessons
    : lessons.filter((l) => l.level === activeLevel);

  const filtered = query.trim()
    ? levelFiltered.filter(
        (l) =>
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.description?.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const displayLessons = filtered ?? levelFiltered;

  const grouped = displayLessons.reduce((acc, lesson) => {
    const inst = lesson.instrument;
    if (!acc[inst]) acc[inst] = [];
    acc[inst].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  // Preferred instrument section first, then default order
  const sections = [
    ...(preferredInstrument && grouped[preferredInstrument]?.length ? [preferredInstrument] : []),
    ...instrumentOrder.filter((inst) => inst !== preferredInstrument && grouped[inst]?.length),
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">Уроки</h1>
          <p className="text-muted-foreground">
            {loading
              ? <span className="inline-block h-4 w-44 rounded bg-muted animate-pulse align-middle" />
              : `${lessons.length} уроков по теории музыки`}
          </p>
        </div>
        <LessonsSearch onSearch={setQuery} />
      </div>

      {/* Level filter */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {LEVEL_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleLevelChange(opt.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              activeLevel === opt.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
        {isLoggedIn && activeLevel !== "all" && activeLevel !== preferredLevel && (
          <button
            onClick={() => {
              setPreferredLevel(activeLevel);
              fetch("/api/user/preferences", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preferredLevel: activeLevel }),
              });
            }}
            className="text-xs text-primary hover:underline ml-1"
          >
            Сохранить как основной
          </button>
        )}
      </div>

      {loading && <LessonsSkeleton />}

      {/* Search results */}
      {!loading && query.trim() && (
        <>
          {(filtered ?? []).length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">Ничего не найдено по запросу «{query}»</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filtered ?? []).map((lesson) => {
                const total = lesson.topics.length;
                const completed = isLoggedIn
                  ? lesson.topics.filter((t) => t.progress?.some((p) => p.completed)).length
                  : 0;
                const isDone = total > 0 && completed === total;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                const photoUrl = getPhotoUrl(lesson.instrument, lesson.order);
                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.slug}`}>
                    <Card className={`relative h-full overflow-hidden hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group ${isDone ? "border-green-500/40" : ""}`}>
                      <Image src={photoUrl} alt="" fill className="object-cover opacity-[0.12] dark:opacity-[0.18] group-hover:opacity-[0.20] dark:group-hover:opacity-[0.28] transition-opacity duration-300" sizes="400px" aria-hidden />
                      <CardHeader className="relative pb-2">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">{instrumentLabels[lesson.instrument]}</span>
                          <div className="flex items-center gap-1.5">
                            <LevelBadge level={lesson.level} />
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            ) : (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />{total}
                              </span>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-base leading-snug">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <CardDescription className="line-clamp-2 text-sm mb-3">{lesson.description}</CardDescription>
                        {isLoggedIn && total > 0 && (
                          isDone ? (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Урок пройден</span>
                          ) : completed > 0 ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{completed} / {total}</span><span>{pct}%</span>
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
        </>
      )}

      {/* Grouped sections */}
      {!loading && !query.trim() && (
        <div className="space-y-14">
          {sections.length === 0 && (
            <p className="text-muted-foreground py-10 text-center">Нет уроков для выбранного уровня</p>
          )}
          {sections.map((instrument) => (
            <div key={instrument} ref={(el) => { sectionRefs.current[instrument] = el; }}>
              {instrument === preferredInstrument && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    Рекомендовано для вас
                  </span>
                </div>
              )}
              <LessonGroup
                instrument={instrument}
                label={instrumentLabels[instrument] || instrument}
                lessons={grouped[instrument]}
                isLoggedIn={isLoggedIn}
                userLevel={preferredLevel}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
