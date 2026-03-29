import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const instrumentLabels: Record<string, string> = {
  GUITAR: "Гитара",
  BASS: "Бас-гитара",
  PIANO: "Фортепиано",
  UKULELE: "Укулеле",
  GENERAL: "Общее",
};

export const dynamic = "force-dynamic";
export const metadata = { title: "Уроки" };

export default async function LessonsPage() {
  const lessons = await db.lesson.findMany({
    where: { published: true },
    include: {
      topics: {
        orderBy: { order: "asc" },
        select: { id: true },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Уроки</h1>
        <p className="text-muted-foreground">
          Выберите урок для изучения теории музыки
        </p>
      </div>

      {lessons.length === 0 ? (
        <p className="text-muted-foreground">Уроки пока не добавлены.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={`/lessons/${lesson.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {instrumentLabels[lesson.instrument] || lesson.instrument}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {lesson.topics.length} тем
                    </span>
                  </div>
                  <CardTitle>{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
