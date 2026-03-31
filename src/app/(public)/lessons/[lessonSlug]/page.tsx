import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-guard";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ChevronLeft } from "lucide-react";

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
    "photo-1461784121038-f088ca1e7714",
    "photo-1459749411175-04bf5292ceea",
    "photo-1470229538611-16ba8c7ffbd7",
    "photo-1519892300165-cb5542fb47c7",
  ],
  PIANO: [
    "photo-1520523839897-bd0b52f945a0",
    "photo-1551969014-7d2c4cddf0b6",
    "photo-1519683109079-d5f539e1542f",
    "photo-1488190211105-8b0e65b80b4e",
    "photo-1571019613454-1cb2f99b2d8b",
  ],
  UKULELE: [
    "photo-1507838153414-b4b713384a76",
    "photo-1525201548942-d8732f6617a0",
    "photo-1510915361894-db8b60106cb1",
    "photo-1511379938547-c1f69419868d",
    "photo-1493225457124-a3eb161ffa5f",
  ],
};

function getPhotoUrl(instrument: string, idx: number) {
  const pool = PHOTOS[instrument] ?? PHOTOS.GENERAL;
  return `https://images.unsplash.com/${pool[idx % pool.length]}?auto=format&fit=crop&w=400&q=60`;
}

const instrumentLabels: Record<string, string> = {
  GUITAR: "Гитара",
  BASS: "Бас-гитара",
  PIANO: "Фортепиано",
  UKULELE: "Укулеле",
  DRUMS: "Барабаны",
  GENERAL: "Общая теория",
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lessonSlug: string }> }) {
  const { lessonSlug } = await params;
  const lesson = await db.lesson.findUnique({ where: { slug: lessonSlug } });
  return { title: lesson?.title || "Урок" };
}

export default async function LessonPage({ params }: { params: Promise<{ lessonSlug: string }> }) {
  const { lessonSlug } = await params;
  const session = await getSession();

  const lesson = await db.lesson.findUnique({
    where: { slug: lessonSlug, published: true },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: {
          progress: session?.user
            ? { where: { userId: session.user.id } }
            : undefined,
        },
      },
    },
  });

  if (!lesson) notFound();

  const completedCount = lesson.topics.filter(
    (t) => t.progress?.some((p) => p.completed)
  ).length;
  const progressPct = lesson.topics.length
    ? Math.round((completedCount / lesson.topics.length) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/lessons"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Все уроки
      </Link>

      {/* Lesson header */}
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">
          {instrumentLabels[lesson.instrument] || lesson.instrument}
        </Badge>
        <div className="flex items-start gap-4">
          <span className="text-5xl font-bold text-muted-foreground/15 leading-none select-none hidden sm:block">
            {String(lesson.order).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-muted-foreground">{lesson.description}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {session?.user && lesson.topics.length > 0 && (
          <div className="mt-6 max-w-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Прогресс</span>
              <span>{completedCount} / {lesson.topics.length}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Topics grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lesson.topics.map((topic, index) => {
          const isCompleted = topic.progress?.some((p) => p.completed);
          const photoUrl = getPhotoUrl(lesson.instrument, index);
          return (
            <Link
              key={topic.id}
              href={`/lessons/${lesson.slug}/${topic.slug}`}
            >
              <Card className={`relative h-full overflow-hidden cursor-pointer transition-all hover:border-primary/40 hover:shadow-md group ${isCompleted ? "border-green-500/30" : ""}`}>
                <Image
                  src={photoUrl}
                  alt=""
                  fill
                  className="object-cover opacity-[0.12] dark:opacity-[0.18] group-hover:opacity-[0.20] dark:group-hover:opacity-[0.28] transition-opacity duration-300"
                  sizes="400px"
                  aria-hidden
                />
                <CardHeader className="relative pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl font-bold text-muted-foreground/20 group-hover:text-primary/20 transition-colors leading-none select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                    )}
                  </div>
                  <CardTitle className="text-sm font-semibold leading-snug">
                    {topic.title}
                  </CardTitle>
                  {topic.description && (
                    <CardDescription className="text-xs line-clamp-2">
                      {topic.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
