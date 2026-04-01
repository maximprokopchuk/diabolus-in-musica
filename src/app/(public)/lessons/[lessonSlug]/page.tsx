import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLessonBySlug } from "@/lib/content";
import { getSession } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ChevronLeft } from "lucide-react";

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
  const lesson = getLessonBySlug(lessonSlug);
  return { title: lesson?.title || "Урок" };
}

export default async function LessonPage({ params }: { params: Promise<{ lessonSlug: string }> }) {
  const { lessonSlug } = await params;
  const session = await getSession();

  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) notFound();

  // Load user progress for this lesson's topics
  const completedSlugs = new Set<string>();
  if (session?.user) {
    const rows = await db.userProgress.findMany({
      where: { userId: session.user.id, lessonSlug, completed: true },
      select: { topicSlug: true },
    });
    rows.forEach((r) => completedSlugs.add(r.topicSlug));
  }

  const completedCount = lesson.topics.filter((t) => completedSlugs.has(t.slug)).length;
  const progressPct = lesson.topics.length
    ? Math.round((completedCount / lesson.topics.length) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <Link
        href="/lessons"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Все уроки
      </Link>

      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lesson.topics.map((topic, index) => {
          const isCompleted = completedSlugs.has(topic.slug);
          const photoUrl = getPhotoUrl(lesson.instrument, index);
          return (
            <Link
              key={topic.slug}
              href={`/lessons/${lesson.slug}/${topic.slug}`}
              className="animate-in fade-in slide-in-from-bottom-3 duration-300 block"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className={`relative flex flex-col min-h-[140px] rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300
                shadow-sm hover:-translate-y-1 hover:shadow-[0_6px_24px_-4px_oklch(0_0_0/0.12)] dark:hover:shadow-[0_6px_24px_-4px_oklch(0_0_0/0.5)] active:scale-[0.99]
                ${isCompleted ? "border-green-500/40 hover:border-green-500/60 dark:border-green-500/30 dark:hover:border-green-500/50" : "border-border hover:border-primary/40 dark:hover:border-primary/50"}
              `}>
                <Image
                  src={photoUrl}
                  alt=""
                  fill
                  className="object-cover opacity-45 dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                  sizes="400px"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-linear-to-b from-card/5 via-card/48 to-card/95 dark:from-background/5 dark:via-background/40 dark:to-background/88" />
                <div className="relative flex flex-col flex-1 p-5 gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl font-black text-foreground/10 dark:text-foreground/20 group-hover:text-primary/15 dark:group-hover:text-primary/25 transition-colors leading-none select-none tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-1" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-1 group-hover:text-primary/30 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-end">
                    <p className="font-semibold text-sm leading-snug mb-1 text-foreground dark:text-white">{topic.title}</p>
                    {topic.description && (
                      <p className="text-xs text-muted-foreground dark:text-white/60 line-clamp-2 leading-relaxed">{topic.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
