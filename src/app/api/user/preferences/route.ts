import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { preferredInstrument: true, preferredLevel: true },
  });
  return NextResponse.json({
    preferredInstrument: user?.preferredInstrument ?? null,
    preferredLevel: user?.preferredLevel ?? null,
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { preferredInstrument, preferredLevel } = body;

  const validInstruments = ["GUITAR", "BASS", "DRUMS", "PIANO", "UKULELE", "GENERAL"];
  const validLevels = ["beginner", "intermediate", "advanced"];

  await db.user.update({
    where: { id: session.user.id },
    data: {
      onboardingCompleted: true,
      ...(preferredInstrument && validInstruments.includes(preferredInstrument)
        ? { preferredInstrument }
        : {}),
      ...(preferredLevel && validLevels.includes(preferredLevel)
        ? { preferredLevel }
        : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
