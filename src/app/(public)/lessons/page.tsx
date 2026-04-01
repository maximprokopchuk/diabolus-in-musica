"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [showAllLevels, setShowAllLevels] = useState(false);
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
        const allLevels = data.showAllLevels ?? false;
        setPreferredLevel(lvl);
        setShowAllLevels(allLevels);
        // init filter: show all if flagged, else use preferredLevel
        if (allLevels || !lvl) setActiveLevel("all");
        else setActiveLevel(lvl);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLevelChange(level: string) {
    setActiveLevel(level);
  }

  function handleSaveFilter() {
    const isAll = activeLevel === "all";
    setShowAllLevels(isAll);
    fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showAllLevels: isAll }),
    });
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
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <h1 className="text-3xl font-bold mb-1.5 tracking-tight">Уроки</h1>
          <p className="text-muted-foreground">
            {loading
              ? <span className="inline-block h-4 w-44 rounded bg-muted animate-pulse align-middle" />
              : `${displayLessons.length} уроков по теории музыки`}
          </p>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "100ms" }}>
          <LessonsSearch onSearch={setQuery} />
        </div>
      </div>

      {/* Level filter */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {LEVEL_OPTIONS.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => handleLevelChange(opt.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border animate-in fade-in slide-in-from-left-2 duration-300 hover:scale-[1.03] active:scale-[0.97] ${
              activeLevel === opt.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-border bg-card text-foreground/60 hover:border-primary/40 hover:text-foreground"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {opt.label}
          </button>
        ))}
        {isLoggedIn && (() => {
          const currentIsAll = activeLevel === "all";
          const alreadySaved = currentIsAll === showAllLevels;
          return !alreadySaved ? (
            <button
              onClick={handleSaveFilter}
              className="text-xs text-primary hover:underline ml-1"
            >
              Запомнить
            </button>
          ) : null;
        })()}
      </div>

      {loading && <LessonsSkeleton />}

      {/* Search results */}
      {!loading && query.trim() && (
        <>
          {(filtered ?? []).length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">Ничего не найдено по запросу «{query}»</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filtered ?? []).map((lesson, idx) => {
                const total = lesson.topics.length;
                const completed = isLoggedIn
                  ? lesson.topics.filter((t) => t.progress?.some((p) => p.completed)).length
                  : 0;
                const isDone = total > 0 && completed === total;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                const photoUrl = getPhotoUrl(lesson.instrument, lesson.order);
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.slug}`}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${Math.min(idx * 50, 350)}ms` }}
                  >
                    <div className={`relative flex flex-col min-h-[200px] rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300
                      shadow-sm hover:-translate-y-1 hover:shadow-[0_6px_24px_-4px_oklch(0_0_0/0.12)] dark:hover:shadow-[0_6px_24px_-4px_oklch(0_0_0/0.5)] active:scale-[0.99]
                      ${isDone ? "border-green-500/40 hover:border-green-500/60 dark:border-green-500/30 dark:hover:border-green-500/50" : "border-border hover:border-primary/40 dark:hover:border-primary/50"}
                    `}>
                      <Image src={photoUrl} alt="" fill className="object-cover opacity-45 dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-55 group-hover:scale-105 transition-all duration-500" sizes="400px" aria-hidden />
                      <div className="absolute inset-0 bg-linear-to-b from-card/5 via-card/50 to-card/95 dark:from-background/10 dark:via-background/45 dark:to-background/88" />
                      <div className="relative flex flex-col flex-1 p-5 gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs text-muted-foreground font-medium">{instrumentLabels[lesson.instrument]}</span>
                          <div className="flex items-center gap-1.5">
                            <LevelBadge level={lesson.level} />
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />{total}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-base leading-snug mb-1.5">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{lesson.description}</p>
                          )}
                        </div>
                        {isLoggedIn && total > 0 && (
                          isDone ? (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Урок пройден</span>
                          ) : completed > 0 ? (
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{completed} / {total}</span><span>{pct}%</span>
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
                  <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full animate-in fade-in zoom-in-90 duration-400">
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
                defaultOpen={!preferredInstrument || instrument === preferredInstrument}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
