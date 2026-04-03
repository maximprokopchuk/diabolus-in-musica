import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const errorReportSchema = z.object({
  lessonSlug: z.string().min(1),
  topicSlug: z.string().optional(),
  description: z.string().min(1).max(1000),
  pageUrl: z.string().optional(),
});

export async function POST(req: Request) {
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
