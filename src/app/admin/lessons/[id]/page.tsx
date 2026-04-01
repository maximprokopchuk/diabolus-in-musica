import { notFound } from "next/navigation";
import Link from "next/link";
import { getLessonBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLessonBySlug(id);
  return { title: lesson?.title || "Урок" };
}

export default async function AdminLessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonBySlug(id);
  if (!lesson) notFound();

  return (
    <div>
      <Link
        href="/admin/lessons"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Все уроки
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{lesson.title}</h1>
        <p className="text-muted-foreground text-sm">{lesson.description}</p>
        <div className="flex gap-2 mt-3">
          <Badge variant="secondary">{lesson.instrument}</Badge>
          <Badge variant="outline">{lesson.level}</Badge>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Темы ({lesson.topics.length})</h2>
      <div className="space-y-2">
        {lesson.topics.map((topic, i) => (
          <Card key={topic.slug}>
            <CardHeader className="py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <CardTitle className="text-sm font-medium">
                  <Link
                    href={`/lessons/${lesson.slug}/${topic.slug}`}
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    {topic.title}
                  </Link>
                </CardTitle>
                <span className="text-xs text-muted-foreground ml-auto">{topic.slug}</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6 p-3 bg-muted rounded-lg">
        Файл: <code>content/lessons/{lesson.instrument.toLowerCase()}/{lesson.slug}/index.md</code>
      </p>
    </div>
  );
}
