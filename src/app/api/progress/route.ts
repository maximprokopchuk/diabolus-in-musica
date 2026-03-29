import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-guard";
import { z } from "zod";

const progressSchema = z.object({
  topicId: z.string().min(1),
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
    include: {
      topic: {
        include: { lesson: { select: { id: true, title: true, slug: true } } },
      },
    },
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
    const { topicId, completed } = progressSchema.parse(body);

    const progress = await db.userProgress.upsert({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        topicId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
