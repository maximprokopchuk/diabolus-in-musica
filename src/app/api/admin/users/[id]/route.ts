import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbidden } from "@/lib/auth-guard";
import { z } from "zod";

const updateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

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
    const { role } = updateUserSchema.parse(body);

    const user = await db.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 400 });
  }
}
