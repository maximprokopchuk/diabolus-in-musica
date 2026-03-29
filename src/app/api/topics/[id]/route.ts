import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbidden } from "@/lib/auth-guard";
import { updateTopicSchema } from "@/lib/validators/topic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const topic = await db.topic.findUnique({
    where: { id },
    include: {
      lesson: true,
      theoryBlocks: { orderBy: { order: "asc" } },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Тема не найдена" }, { status: 404 });
  }

  return NextResponse.json(topic);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const data = updateTopicSchema.parse(body);

    const topic = await db.topic.update({
      where: { id },
      data,
    });

    return NextResponse.json(topic);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  const { id } = await params;

  await db.topic.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
