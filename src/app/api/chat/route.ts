import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, unauthorized } from "@/lib/auth-guard";
import { chatStream } from "@/lib/ai/client";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { z } from "zod";

const chatRequestSchema = z.object({
  topicId: z.string().min(1),
  message: z.string().min(1).max(2000),
});

export async function GET(req: Request) {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return unauthorized();
  }

  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  if (!topicId) {
    return NextResponse.json({ error: "topicId обязателен" }, { status: 400 });
  }

  const messages = await db.chatMessage.findMany({
    where: { userId: session.user.id, topicId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { topicId, message } = chatRequestSchema.parse(body);

    const topic = await db.topic.findUnique({
      where: { id: topicId },
      include: {
        theoryBlocks: { orderBy: { order: "asc" } },
        lesson: true,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Тема не найдена" }, { status: 404 });
    }

    // Get recent chat history
    const history = await db.chatMessage.findMany({
      where: { userId: session.user.id, topicId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    // Save user message
    await db.chatMessage.create({
      data: {
        userId: session.user.id,
        topicId,
        role: "user",
        content: message,
      },
    });

    // Build messages for AI
    const systemPrompt = buildChatSystemPrompt(topic);
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const stream = await chatStream(messages);

    // Stream response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          // Save assistant message
          await db.chatMessage.create({
            data: {
              userId: session.user.id,
              topicId,
              role: "assistant",
              content: fullResponse,
            },
          });

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Ошибка AI сервиса" }, { status: 500 });
  }
}
