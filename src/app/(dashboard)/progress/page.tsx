import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { getAllLessons } from "@/lib/content";
import { getSession } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Trophy, Flame, ArrowRight } from "lucide-react";
import { ProgressLevelFilter } from "@/components/progress/level-filter";

export const dynamic = "force-dynamic";
export const metadata = { title: "Прогресс" };

const instrumentLabels: Record<string, string> = {
  GUITAR: "Гитара",
  BASS: "Бас-гитара",
  PIANO: "Фортепиано",
  UKULELE: "Укулеле",
  DRUMS: "Барабаны",
  GENERAL: "Общая теория",
};

const MOTIVATIONAL = [
  "Каждая тема — шаг к мастерству.",
  "Теория открывает то, что слух чувствует интуитивно.",
  "Лучший музыкант — тот, кто не останавливается.",
  "Понимание гармонии меняет то, как ты слышишь музыку.",
  "Продолжай. Ты уже дальше, чем думаешь.",
];

function getMotivational(seed: number) {
  return MOTIVATIONAL[seed % MOTIVATIONAL.length];
}

function calcStreak(completedDates: Date[]): number {
  if (!completedDates.length) return 0;
  const days = Array.from(
    new Set(completedDates.map((d) => d.toISOString().slice(0, 10)))
  ).sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (days[0] !== today && days[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const params = await searchParams;

  const userPrefs = await db.user.findUnique({
    where: { id: session.user.id },
    select: { preferredLevel: true },
  });

  const VALID_LEVELS = ["beginner", "intermediate", "advanced"] as const;
  type ValidLevel = (typeof VALID_LEVELS)[number];

  const rawLevel = params.level ?? userPrefs?.preferredLevel ?? "all";
  const activeLevel = VALID_LEVELS.includes(rawLevel as ValidLevel) ? rawLevel : "all";

  // Load all lessons from filesystem + user progress from DB
  const allLessonsData = getAllLessons();
  const filteredLessons =
    activeLevel === "all"
      ? allLessonsData
      : allLessonsData.filter((l) => l.level === activeLevel);

  const progressRows = await db.userProgress.findMany({
    where: { userId: session.user.id },
  });
  const completedSet = new Set(
    progressRows
      .filter((p) => p.completed)
      .map((p) => `${p.lessonSlug}::${p.topicSlug}`)
  );
  const completedDates = progressRows
    .filter((p) => p.completed && p.completedAt)
    .map((p) => p.completedAt!);

  // Compute stats
  const totalTopics = filteredLessons.reduce((s, l) => s + l.topics.length, 0);
  const totalCompleted = filteredLessons.reduce(
    (s, l) =>
      s + l.topics.filter((t) => completedSet.has(`${l.slug}::${t.slug}`)).length,
    0
  );
  const totalPercent =
    totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
  const completedLessons = filteredLessons.filter(
    (l) =>
      l.topics.length > 0 &&
      l.topics.every((t) => completedSet.has(`${l.slug}::${t.slug}`))
  ).length;

  const streak = calcStreak(completedDates);

  // Last touched topic (for Continue CTA)
  const lastProgress = progressRows
    .filter((p) => p.completed && p.completedAt)
    .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0] ??
    null;

  const motivational = getMotivational(totalCompleted);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          <h1 className="text-3xl font-bold mb-1">Мой прогресс</h1>
          <p className="text-muted-foreground italic text-sm">{motivational}</p>
        </div>
        {lastProgress && (
          <Link
            href={`/lessons/${lastProgress.lessonSlug}/${lastProgress.topicSlug}`}
            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150"
          >
            Продолжить
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Level filter */}
      <Suspense>
        <ProgressLevelFilter active={activeLevel} />
      </Suspense>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Card className="text-center animate-in fade-in zoom-in-95 duration-300" style={{ animationDelay: "0ms" }}>
          <CardContent className="pt-5 pb-4">
            <div className="text-3xl font-bold text-primary mb-1">{totalPercent}%</div>
            <div className="text-xs text-muted-foreground">Общий прогресс</div>
          </CardContent>
        </Card>
        <Card className="text-center animate-in fade-in zoom-in-95 duration-300" style={{ animationDelay: "75ms" }}>
          <CardContent className="pt-5 pb-4">
            <div className="text-3xl font-bold mb-1">{totalCompleted}</div>
            <div className="text-xs text-muted-foreground">Тем пройдено</div>
          </CardContent>
        </Card>
        <Card className="text-center animate-in fade-in zoom-in-95 duration-300" style={{ animationDelay: "150ms" }}>
          <CardContent className="pt-5 pb-4">
            <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
              {streak > 0 && <Flame className="h-6 w-6 text-orange-500" />}
              {streak}
            </div>
            <div className="text-xs text-muted-foreground">
              {streak === 1 ? "День подряд" : streak > 1 ? "Дней подряд" : "Стрик"}
            </div>
          </CardContent>
        </Card>
        <Card className="text-center animate-in fade-in zoom-in-95 duration-300" style={{ animationDelay: "225ms" }}>
          <CardContent className="pt-5 pb-4">
            <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
              {completedLessons > 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
              {completedLessons}
            </div>
            <div className="text-xs text-muted-foreground">Уроков завершено</div>
          </CardContent>
        </Card>
      </div>

      {/* Global progress bar */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-400" style={{ animationDelay: "300ms" }}>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Общий прогресс</span>
          <span>{totalCompleted} / {totalTopics}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${totalPercent}%` }}
          />
        </div>
      </div>

      {totalCompleted === 0 && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">Вы ещё не прошли ни одной темы. Начните прямо сейчас!</p>
            <Link
              href="/lessons"
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap hover:bg-primary/90 transition-colors"
            >
              Перейти к урокам
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Per-lesson breakdown */}
      <div className="space-y-4">
        {filteredLessons.map((lesson, lessonIdx) => {
          const total = lesson.topics.length;
          const completed = lesson.topics.filter((t) =>
            completedSet.has(`${lesson.slug}::${t.slug}`)
          ).length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isDone = total > 0 && completed === total;
          if (completed === 0) return null;

          return (
            <Card
              key={lesson.slug}
              className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${isDone ? "border-green-500/30" : ""}`}
              style={{ animationDelay: `${Math.min(lessonIdx * 75, 400)}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-mono text-muted-foreground/40 shrink-0">
                      {String(lesson.order).padStart(2, "0")}
                    </span>
                    <CardTitle className="text-sm font-semibold truncate">
                      <Link href={`/lessons/${lesson.slug}`} className="hover:text-primary transition-colors">
                        {lesson.title}
                      </Link>
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {instrumentLabels[lesson.instrument] || lesson.instrument}
                    </Badge>
                    {isDone ? (
                      <Badge className="text-xs bg-green-500 hover:bg-green-500">✓ Готово</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">{completed}/{total}</span>
                    )}
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all ${isDone ? "bg-green-500" : "bg-primary"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </CardHeader>
              {!isDone && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    {lesson.topics.map((topic) => {
                      const done = completedSet.has(`${lesson.slug}::${topic.slug}`);
                      return (
                        <Link
                          key={topic.slug}
                          href={`/lessons/${lesson.slug}/${topic.slug}`}
                          className="flex items-center gap-2 text-xs py-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {done ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                          )}
                          <span className={done ? "text-foreground/60 line-through" : ""}>{topic.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
