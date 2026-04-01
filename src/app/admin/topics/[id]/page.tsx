import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLessons, getTopicContent } from "@/lib/content";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function AdminTopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // id is "lessonSlug--topicSlug"
  const [lessonSlug, topicSlug] = id.split("--");
  if (!lessonSlug || !topicSlug) notFound();

  const topic = getTopicContent(lessonSlug, topicSlug);
  const allLessons = getAllLessons();
  const lesson = allLessons.find((l) => l.slug === lessonSlug);
  if (!topic || !lesson) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`/admin/lessons/${lesson.slug}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        {lesson.title}
      </Link>

      <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
      {topic.description && (
        <p className="text-muted-foreground text-sm mb-6">{topic.description}</p>
      )}

      <Separator className="mb-6" />

      <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
        {topic.content}
      </div>

      <p className="text-xs text-muted-foreground mt-6 p-3 bg-muted rounded-lg">
        Файл: <code>content/lessons/{lesson.instrument.toLowerCase()}/{lesson.slug}/</code>
      </p>
    </div>
  );
}
