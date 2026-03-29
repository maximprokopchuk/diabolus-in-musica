import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbidden } from "@/lib/auth-guard";
import { updateLessonSchema } from "@/lib/validators/lesson";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const lesson = await db.lesson.findUnique({
    where: { id },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: {
          theoryBlocks: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Урок не найден" }, { status: 404 });
  }

  return NextResponse.json(lesson);
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
    const data = updateLessonSchema.parse(body);

    const lesson = await db.lesson.update({
      where: { id },
      data,
    });

    return NextResponse.json(lesson);
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

  await db.lesson.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
