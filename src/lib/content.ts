/**
 * Content layer — reads lesson/topic data from markdown files.
 * Server-side only (uses fs). Never import in client components.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/lessons");

export type LessonMeta = {
  slug: string;
  title: string;
  description: string;
  instrument: string;
  level: string;
  order: number;
  published: boolean;
};

export type TopicMeta = {
  slug: string;
  lessonSlug: string;
  title: string;
  description: string;
  order: number;
};

export type LessonWithTopics = LessonMeta & { topics: TopicMeta[] };

export type TopicContent = TopicMeta & { content: string };

// Module-level caches — populated once per process (dev: restart to pick up changes)
let _lessons: LessonWithTopics[] | null = null;
// keyed by "lessonSlug::topicSlug"
let _topicContent: Map<string, TopicContent> | null = null;

function slugFromFilename(filename: string): string {
  return filename.replace(/^\d+-/, "").replace(/\.md$/, "");
}

function loadAll(): {
  lessons: LessonWithTopics[];
  topicContent: Map<string, TopicContent>;
} {
  if (_lessons && _topicContent) {
    return { lessons: _lessons, topicContent: _topicContent };
  }

  const lessons: LessonWithTopics[] = [];
  const topicContent = new Map<string, TopicContent>();

  const instruments = fs
    .readdirSync(CONTENT_DIR)
    .filter((d) => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory());

  for (const instrument of instruments) {
    const instrumentDir = path.join(CONTENT_DIR, instrument);
    const lessonDirs = fs
      .readdirSync(instrumentDir)
      .filter((d) => fs.statSync(path.join(instrumentDir, d)).isDirectory());

    for (const lessonSlug of lessonDirs) {
      const lessonDir = path.join(instrumentDir, lessonSlug);
      const indexPath = path.join(lessonDir, "index.md");
      if (!fs.existsSync(indexPath)) continue;

      const { data } = matter(fs.readFileSync(indexPath, "utf-8"));
      if (!data.published) continue;

      const topicFiles = fs
        .readdirSync(lessonDir)
        .filter((f) => f.endsWith(".md") && f !== "index.md")
        .sort();

      const topics: TopicMeta[] = topicFiles.map((f) => {
        const { data: td, content } = matter(
          fs.readFileSync(path.join(lessonDir, f), "utf-8")
        );
        const slug = slugFromFilename(f);
        const meta: TopicMeta = {
          slug,
          lessonSlug,
          title: String(td.title ?? ""),
          description: String(td.description ?? ""),
          order: Number(td.order ?? 0),
        };
        // Store full content in the content cache
        topicContent.set(`${lessonSlug}::${slug}`, { ...meta, content });
        return meta;
      });

      lessons.push({
        slug: lessonSlug,
        title: String(data.title ?? ""),
        description: String(data.description ?? ""),
        instrument: String(data.instrument ?? "GENERAL"),
        level: String(data.level ?? "beginner"),
        order: Number(data.order ?? 0),
        published: Boolean(data.published),
        topics: topics.sort((a, b) => a.order - b.order),
      });
    }
  }

  lessons.sort((a, b) => a.order - b.order);

  _lessons = lessons;
  _topicContent = topicContent;

  return { lessons, topicContent };
}

export function getAllLessons(): LessonWithTopics[] {
  return loadAll().lessons;
}

export function getLessonBySlug(slug: string): LessonWithTopics | null {
  return loadAll().lessons.find((l) => l.slug === slug) ?? null;
}

export function getTopicContent(
  lessonSlug: string,
  topicSlug: string
): TopicContent | null {
  const { topicContent } = loadAll();
  return topicContent.get(`${lessonSlug}::${topicSlug}`) ?? null;
}
