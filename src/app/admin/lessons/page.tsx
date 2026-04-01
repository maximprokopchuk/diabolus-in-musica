import Link from "next/link";
import { getAllLessons } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata = { title: "Уроки" };

const instrumentLabels: Record<string, string> = {
  GUITAR: "Гитара",
  BASS: "Бас-гитара",
  PIANO: "Фортепиано",
  UKULELE: "Укулеле",
  DRUMS: "Барабаны",
  GENERAL: "Общая теория",
};

const levelLabels: Record<string, string> = {
  beginner: "Базовый",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

export default function AdminLessonsPage() {
  const lessons = getAllLessons();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Уроки</h1>
        <p className="text-sm text-muted-foreground">{lessons.length} уроков (из MD-файлов)</p>
      </div>

      <div className="space-y-2">
        {lessons.map((lesson) => (
          <Card key={lesson.slug}>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground/40 shrink-0">
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <CardTitle className="text-sm font-semibold truncate">
                    <Link
                      href={`/lessons/${lesson.slug}`}
                      target="_blank"
                      className="hover:text-primary transition-colors"
                    >
                      {lesson.title}
                    </Link>
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {instrumentLabels[lesson.instrument] || lesson.instrument}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {levelLabels[lesson.level] || lesson.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {lesson.topics.length} тем
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6 p-3 bg-muted rounded-lg">
        Уроки хранятся в <code>content/lessons/</code>. Для редактирования — обновляйте MD-файлы напрямую.
      </p>
    </div>
  );
}
