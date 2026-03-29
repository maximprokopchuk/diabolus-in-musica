import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Админ-панель" };

export default async function AdminPage() {
  const [lessonsCount, topicsCount, usersCount] = await Promise.all([
    db.lesson.count(),
    db.topic.count(),
    db.user.count(),
  ]);

  const stats = [
    { label: "Уроков", value: lessonsCount, icon: BookOpen },
    { label: "Тем", value: topicsCount, icon: FileText },
    { label: "Пользователей", value: usersCount, icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Обзор</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
