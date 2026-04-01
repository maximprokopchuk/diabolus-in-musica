import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-guard";
import { z } from "zod";

const progressSchema = z.object({
  lessonSlug: z.string().min(1),
  topicSlug: z.string().min(1),
  completed: z.boolean(),
});

export async function GET() {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return unauthorized();
  }

  const progress = await db.userProgress.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(progress);
}

export async function POST(req: Request) {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { lessonSlug, topicSlug, completed } = progressSchema.parse(body);

    const progress = await db.userProgress.upsert({
      where: {
        userId_lessonSlug_topicSlug: {
          userId: session.user.id,
          lessonSlug,
          topicSlug,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonSlug,
        topicSlug,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
