import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const prefsSchema = z.object({
  preferredInstrument: z
    .enum(["GUITAR", "BASS", "DRUMS", "PIANO", "UKULELE", "GENERAL"])
    .nullable()
    .optional(),
  preferredLevel: z
    .enum(["beginner", "intermediate", "advanced"])
    .nullable()
    .optional(),
  showAllLevels: z.boolean().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { preferredInstrument: true, preferredLevel: true, showAllLevels: true },
  });
  return NextResponse.json({
    preferredInstrument: user?.preferredInstrument ?? null,
    preferredLevel: user?.preferredLevel ?? null,
    showAllLevels: user?.showAllLevels ?? false,
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = prefsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const { preferredInstrument, preferredLevel, showAllLevels } = parsed.data;

  await db.user.update({
    where: { id: session.user.id },
    data: {
      onboardingCompleted: true,
      ...(preferredInstrument !== undefined
        ? { preferredInstrument: preferredInstrument ?? null }
        : {}),
      ...(preferredLevel !== undefined
        ? { preferredLevel: preferredLevel ?? null }
        : {}),
      ...(showAllLevels !== undefined ? { showAllLevels } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
