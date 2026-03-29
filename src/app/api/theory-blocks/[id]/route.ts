import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbidden } from "@/lib/auth-guard";
import { updateTheoryBlockSchema } from "@/lib/validators/theory-block";

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
    const data = updateTheoryBlockSchema.parse(body);

    const { metadata, ...rest } = data;
    const block = await db.theoryBlock.update({
      where: { id },
      data: {
        ...rest,
        ...(metadata !== undefined
          ? { metadata: metadata === null ? undefined : (metadata as Record<string, string>) }
          : {}),
      },
    });

    return NextResponse.json(block);
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

  await db.theoryBlock.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
