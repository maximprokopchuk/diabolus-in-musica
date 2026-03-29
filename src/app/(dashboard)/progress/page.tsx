import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Прогресс" };

export default async function ProgressPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const lessons = await db.lesson.findMany({
    where: { published: true },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: {
          progress: { where: { userId: session.user.id } },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Мой прогресс</h1>
      <p className="text-muted-foreground mb-8">Отслеживайте изученные темы</p>

      <div className="space-y-6">
        {lessons.map((lesson) => {
          const total = lesson.topics.length;
          const completed = lesson.topics.filter((t) =>
            t.progress.some((p) => p.completed)
          ).length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <Card key={lesson.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    <Link href={`/lessons/${lesson.slug}`} className="hover:underline">
                      {lesson.title}
                    </Link>
                  </CardTitle>
                  <Badge variant={percent === 100 ? "default" : "secondary"}>
                    {completed}/{total} ({percent}%)
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {lesson.topics.map((topic) => {
                    const done = topic.progress.some((p) => p.completed);
                    return (
                      <Link
                        key={topic.id}
                        href={`/lessons/${lesson.slug}/${topic.slug}`}
                        className="flex items-center gap-2 text-sm py-1 hover:text-foreground text-muted-foreground"
                      >
                        <CheckCircle
                          className={`h-4 w-4 ${
                            done ? "text-green-500" : "text-muted-foreground/30"
                          }`}
                        />
                        <span className={done ? "text-foreground" : ""}>
                          {topic.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
