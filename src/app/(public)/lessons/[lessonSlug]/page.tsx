import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-guard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          {lesson.instrument}
        </Badge>
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.description}</p>
        {session?.user && (
          <p className="text-sm text-muted-foreground mt-2">
            Прогресс: {completedCount}/{lesson.topics.length} тем пройдено
          </p>
        )}
      </div>

      <div className="space-y-3 max-w-2xl">
        {lesson.topics.map((topic, index) => {
          const isCompleted = topic.progress?.some((p) => p.completed);
          return (
            <Link
              key={topic.id}
              href={`/lessons/${lesson.slug}/${topic.slug}`}
            >
              <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                <CardHeader className="flex-row items-center gap-4 py-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    {topic.description && (
                      <CardDescription className="text-sm">
                        {topic.description}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
