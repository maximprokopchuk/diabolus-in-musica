import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Профиль" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Профиль</h1>

      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>{session.user.name || "Пользователь"}</CardTitle>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
              <Badge variant="secondary" className="mt-1">
                {session.user.role === "ADMIN" ? "Администратор" : "Ученик"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Управление профилем будет добавлено в будущих обновлениях.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
