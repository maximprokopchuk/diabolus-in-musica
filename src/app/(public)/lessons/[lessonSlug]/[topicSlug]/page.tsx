import { notFound } from "next/navigation";
import Link from "next/link";
import { getLessonBySlug, getTopicContent } from "@/lib/content";
import { getSession } from "@/lib/auth-guard";
import { db } from "@/lib/db";
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
  const topic = getTopicContent(lessonSlug, topicSlug);
  return { title: topic?.title || "Тема" };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ lessonSlug: string; topicSlug: string }>;
}) {
  const { lessonSlug, topicSlug } = await params;
  const session = await getSession();

  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) notFound();

  const topic = getTopicContent(lessonSlug, topicSlug);
  if (!topic) notFound();

  const topicIndex = lesson.topics.findIndex((t) => t.slug === topicSlug);
  const prevTopic = topicIndex > 0 ? lesson.topics[topicIndex - 1] : null;
  const nextTopic =
    topicIndex < lesson.topics.length - 1
      ? lesson.topics[topicIndex + 1]
      : null;

  let isCompleted = false;
  if (session?.user) {
    const row = await db.userProgress.findUnique({
      where: {
        userId_lessonSlug_topicSlug: {
          userId: session.user.id,
          lessonSlug,
          topicSlug,
        },
      },
    });
    isCompleted = row?.completed ?? false;
  }

  // TheoryBlockRenderer expects a block with { id, type, content, metadata }
  // We adapt the markdown content into a single TEXT block
  const block = {
    id: `${lessonSlug}-${topicSlug}`,
    type: "TEXT" as const,
    content: topic.content,
    metadata: null,
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-sm text-muted-foreground mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
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

      <h1 className="text-3xl font-bold mb-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500 tracking-tight">{topic.title}</h1>
      {topic.description && (
        <p className="text-foreground/60 dark:text-muted-foreground mb-6 text-base leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">{topic.description}</p>
      )}

      <Separator className="mb-8" />

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
        <TheoryBlockRenderer block={block} />
      </div>

      <Separator className="my-8" />

      <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-400 delay-300">
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
            lessonSlug={lessonSlug}
            topicSlug={topicSlug}
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

      <ChatPanel lessonSlug={lessonSlug} topicSlug={topicSlug} />
    </div>
  );
}
