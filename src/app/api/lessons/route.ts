import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-guard";

export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id ?? null;

  const [lessons, userPrefs] = await Promise.all([
    db.lesson.findMany({
      where: { published: true },
      include: {
        topics: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            progress: userId
              ? { where: { userId }, select: { completed: true } }
              : false,
          },
        },
      },
      orderBy: { order: "asc" },
    }),
    userId
      ? db.user.findUnique({
          where: { id: userId },
          select: { preferredInstrument: true, preferredLevel: true },
        })
      : null,
  ]);

  return NextResponse.json({
    lessons,
    isLoggedIn: !!userId,
    preferredInstrument: userPrefs?.preferredInstrument ?? null,
    preferredLevel: userPrefs?.preferredLevel ?? null,
  });
}
