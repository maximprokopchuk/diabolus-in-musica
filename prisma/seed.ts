import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { LessonSeed } from "./seed-data";
import { LESSON_LEVELS } from "./seed-data";

const prisma = new PrismaClient();

async function seedLesson(data: LessonSeed) {
  const lesson = await prisma.lesson.upsert({
    where: { slug: data.slug },
    update: {
      level: data.level ?? LESSON_LEVELS[data.slug] ?? "beginner",
    },
    create: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      instrument: data.instrument,
      level: data.level ?? LESSON_LEVELS[data.slug] ?? "beginner",
      order: data.order,
      published: true,
    },
  });

  for (let i = 0; i < data.topics.length; i++) {
    const t = data.topics[i];
    const topic = await prisma.topic.upsert({
      where: { lessonId_slug: { lessonId: lesson.id, slug: t.slug } },
      update: {},
      create: {
        lessonId: lesson.id,
        title: t.title,
        slug: t.slug,
        description: t.description,
        order: i + 1,
      },
    });

    const existingBlocks = await prisma.theoryBlock.count({ where: { topicId: topic.id } });
    if (existingBlocks === 0) {
      await prisma.theoryBlock.createMany({
        data: t.blocks.map((content, idx) => ({
          topicId: topic.id,
          type: "TEXT" as const,
          content,
          order: idx + 1,
        })),
      });
    }
  }

  console.log(`  ✓ ${data.title} (${data.topics.length} тем)`);
}

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@diabolus.local" },
    update: {},
    create: {
      email: "admin@diabolus.local",
      name: "Admin",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin: admin@diabolus.local / admin123\n");

  const { default: lessons } = await import("./seed-data");
  for (const lesson of lessons) {
    await seedLesson(lesson);
  }

  console.log("\nSeed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
