import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbidden } from "@/lib/auth-guard";
import { createTheoryBlockSchema } from "@/lib/validators/theory-block";
import { reorderSchema } from "@/lib/validators/topic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  if (!topicId) {
    return NextResponse.json({ error: "topicId обязателен" }, { status: 400 });
  }

  const blocks = await db.theoryBlock.findMany({
    where: { topicId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(blocks);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return forbidden();
  }

  try {
    const body = await req.json();
    const data = createTheoryBlockSchema.parse(body);

    const { metadata, ...rest } = data;
    const block = await db.theoryBlock.create({
      data: {
        ...rest,
        metadata: metadata === null ? undefined : (metadata as Record<string, string>),
      },
    });

    return NextResponse.json(block, { status: 201 });
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
        db.theoryBlock.update({
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
