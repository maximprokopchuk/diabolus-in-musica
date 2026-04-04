import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const errorReportSchema = z.object({
  lessonSlug: z.string().min(1).max(200),
  topicSlug: z.string().max(200).optional(),
  description: z.string().min(1).max(1000),
  pageUrl: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit(`error-report:${ip}`, 10, 60_000); // 10 per minute
  if (!rl.success) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { lessonSlug, topicSlug, description, pageUrl } =
      errorReportSchema.parse(body);

    const report = await db.errorReport.create({
      data: { lessonSlug, topicSlug, description, pageUrl },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Неверные данные", details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
