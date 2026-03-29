import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbidden } from "@/lib/auth-guard";
import { createTopicSchema, reorderSchema } from "@/lib/validators/topic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId обязателен" }, { status: 400 });
  }

  const topics = await db.topic.findMany({
    where: { lessonId },
    orderBy: { order: "asc" },
    include: {
      theoryBlocks: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json();
    const data = createTopicSchema.parse(body);

    const topic = await db.topic.create({ data });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json();
    const { items } = reorderSchema.parse(body);

    await db.$transaction(
      items.map((item) =>
        db.topic.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
