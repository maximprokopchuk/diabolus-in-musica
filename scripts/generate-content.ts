/**
 * Generates markdown content files from seed data.
 * Run with: npx tsx scripts/generate-content.ts
 *
 * Output structure:
 *   content/lessons/{instrument}/{lesson-slug}/index.md
 *   content/lessons/{instrument}/{lesson-slug}/{order}-{topic-slug}.md
 */
import * as fs from "fs";
import * as path from "path";
import allLessons, { LESSON_LEVELS } from "../prisma/seed-data";

const CONTENT_DIR = path.join(process.cwd(), "content/lessons");

function esc(s: string): string {
  // Escape backslashes then double-quotes for YAML double-quoted string
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

let totalTopics = 0;

for (const lesson of allLessons) {
  const instrument = lesson.instrument.toLowerCase();
  const level = lesson.level ?? LESSON_LEVELS[lesson.slug] ?? "beginner";
  const lessonDir = path.join(CONTENT_DIR, instrument, lesson.slug);

  fs.mkdirSync(lessonDir, { recursive: true });

  // lesson index.md — metadata only, no body needed
  const indexMd =
    `---\n` +
    `title: "${esc(lesson.title)}"\n` +
    `description: "${esc(lesson.description)}"\n` +
    `instrument: ${lesson.instrument}\n` +
    `level: ${level}\n` +
    `order: ${lesson.order}\n` +
    `published: true\n` +
    `---\n`;

  fs.writeFileSync(path.join(lessonDir, "index.md"), indexMd, "utf-8");

  // topic files
  lesson.topics.forEach((topic, i) => {
    const orderPrefix = String(i + 1).padStart(2, "0");
    const body = topic.blocks.join("\n\n");
    const topicMd =
      `---\n` +
      `title: "${esc(topic.title)}"\n` +
      `description: "${esc(topic.description)}"\n` +
      `order: ${i + 1}\n` +
      `---\n\n` +
      body +
      "\n";

    fs.writeFileSync(
      path.join(lessonDir, `${orderPrefix}-${topic.slug}.md`),
      topicMd,
      "utf-8"
    );
    totalTopics++;
  });
}

console.log(
  `✓ Generated ${allLessons.length} lessons, ${totalTopics} topics → content/lessons/`
);
