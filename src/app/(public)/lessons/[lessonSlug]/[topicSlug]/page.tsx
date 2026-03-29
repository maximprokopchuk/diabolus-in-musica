import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-guard";
import { TheoryBlockRenderer } from "@/components/lessons/theory-block-renderer";
import { TopicCompletionButton } from "@/components/progress/topic-completion-button";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonSlug: string; topicSlug: string }>;
}) {
  const { lessonSlug, topicSlug } = await params;
  const lesson = await db.lesson.findUnique({ where: { slug: lessonSlug } });
  if (!lesson) return { title: "Тема" };
  const topic = await db.topic.findUnique({
    where: { lessonId_slug: { lessonId: lesson.id, slug: topicSlug } },
  });
  return { title: topic?.title || "Тема" };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ lessonSlug: string; topicSlug: string }>;
}) {
  const { lessonSlug, topicSlug } = await params;
  const session = await getSession();

  const lesson = await db.lesson.findUnique({
    where: { slug: lessonSlug, published: true },
    include: {
      topics: { orderBy: { order: "asc" } },
    },
  });

  if (!lesson) notFound();

  const topicIndex = lesson.topics.findIndex((t) => t.slug === topicSlug);
  if (topicIndex === -1) notFound();

  const topic = await db.topic.findUnique({
    where: { lessonId_slug: { lessonId: lesson.id, slug: topicSlug } },
    include: {
      theoryBlocks: { orderBy: { order: "asc" } },
      progress: session?.user
        ? { where: { userId: session.user.id } }
        : undefined,
    },
  });

  if (!topic) notFound();

  const prevTopic = topicIndex > 0 ? lesson.topics[topicIndex - 1] : null;
  const nextTopic =
    topicIndex < lesson.topics.length - 1
      ? lesson.topics[topicIndex + 1]
      : null;

  const isCompleted = topic.progress?.some((p) => p.completed) ?? false;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/lessons" className="hover:text-foreground">
          Уроки
        </Link>
        {" / "}
        <Link
          href={`/lessons/${lesson.slug}`}
          className="hover:text-foreground"
        >
          {lesson.title}
        </Link>
        {" / "}
        <span className="text-foreground">{topic.title}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
      {topic.description && (
        <p className="text-muted-foreground mb-6">{topic.description}</p>
      )}

      <Separator className="mb-8" />

      {/* Theory Blocks */}
      <div className="space-y-6">
        {topic.theoryBlocks.map((block) => (
          <TheoryBlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {topic.theoryBlocks.length === 0 && (
        <p className="text-muted-foreground py-8 text-center">
          Контент этой темы ещё не добавлен.
        </p>
      )}

      <Separator className="my-8" />

      {/* Progress + Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {prevTopic && (
            <Button variant="ghost" render={<Link href={`/lessons/${lesson.slug}/${prevTopic.slug}`} />}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {prevTopic.title}
            </Button>
          )}
        </div>

        {session?.user && (
          <TopicCompletionButton
            topicId={topic.id}
            initialCompleted={isCompleted}
          />
        )}

        <div>
          {nextTopic && (
            <Button variant="ghost" render={<Link href={`/lessons/${lesson.slug}/${nextTopic.slug}`} />}>
              {nextTopic.title}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel topicId={topic.id} />
    </div>
  );
}
