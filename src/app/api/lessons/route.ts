import { NextResponse } from "next/server";
import { getAllLessons } from "@/lib/content";
import { getSession } from "@/lib/auth-guard";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id ?? null;

  const [lessons, userPrefs, progressRows] = await Promise.all([
    Promise.resolve(getAllLessons()),
    userId
      ? db.user.findUnique({
          where: { id: userId },
          select: { preferredInstrument: true, preferredLevel: true, showAllLevels: true },
        })
      : null,
    userId
      ? db.userProgress.findMany({
          where: { userId },
          select: { lessonSlug: true, topicSlug: true, completed: true },
        })
      : [],
  ]);

  // Build a set of completed topic keys for fast lookup
  const completedSet = new Set(
    (progressRows as { lessonSlug: string; topicSlug: string; completed: boolean }[])
      .filter((p) => p.completed)
      .map((p) => `${p.lessonSlug}::${p.topicSlug}`)
  );

  const enriched = lessons.map((lesson) => ({
    id: lesson.slug, // consumers may use id for keys
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    instrument: lesson.instrument,
    level: lesson.level,
    order: lesson.order,
    topics: lesson.topics.map((t) => ({
      id: `${lesson.slug}::${t.slug}`,
      slug: t.slug,
      progress: userId
        ? [{ completed: completedSet.has(`${lesson.slug}::${t.slug}`) }]
        : null,
    })),
  }));

  return NextResponse.json({
    lessons: enriched,
    isLoggedIn: !!userId,
    preferredInstrument: userPrefs?.preferredInstrument ?? null,
    preferredLevel: userPrefs?.preferredLevel ?? null,
    showAllLevels: userPrefs?.showAllLevels ?? false,
  });
}
