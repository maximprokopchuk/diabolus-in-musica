import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, requireAdmin, unauthorized, forbidden } from "@/lib/auth-guard";
import { createLessonSchema } from "@/lib/validators/lesson";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const instrument = searchParams.get("instrument");
  const all = searchParams.get("all") === "true";

  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const lessons = await db.lesson.findMany({
    where: {
      ...(instrument ? { instrument: instrument as never } : {}),
      ...(!all || !isAdmin ? { published: true } : {}),
    },
    include: {
      topics: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, slug: true, order: true },
      },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(lessons);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json();
    const data = createLessonSchema.parse(body);

    const lesson = await db.lesson.create({ data });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
