import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, ClipboardList, ExternalLink } from "lucide-react";
import { toggleResolved } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Репорты ошибок — Админ-панель" };

export default async function ErrorReportsPage() {
  const session = await getSession();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  const reports = await db.errorReport.findMany({
    orderBy: { createdAt: "desc" },
  });

  const total = reports.length;
  const open = reports.filter((r) => !r.resolved).length;
  const resolved = reports.filter((r) => r.resolved).length;

  const stats = [
    { label: "Всего репортов", value: total, icon: ClipboardList },
    { label: "Открытых", value: open, icon: AlertCircle },
    { label: "Закрытых", value: resolved, icon: CheckCircle2 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Репорты ошибок</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
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

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <CheckCircle2 className="h-12 w-12 opacity-30" />
          <p className="text-lg font-medium">Репортов пока нет</p>
          <p className="text-sm">Когда пользователи сообщат об ошибках — они появятся здесь.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Урок / Тема</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => {
              const lessonUrl = report.topicSlug
                ? `/lessons/${report.lessonSlug}/${report.topicSlug}`
                : `/lessons/${report.lessonSlug}`;

              const description =
                report.description.length > 80
                  ? report.description.slice(0, 80) + "…"
                  : report.description;

              return (
                <TableRow key={report.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString("ru")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link
                        href={lessonUrl}
                        className="hover:underline font-medium text-sm"
                        target="_blank"
                      >
                        {report.lessonSlug}
                        {report.topicSlug && (
                          <span className="text-muted-foreground font-normal">
                            {" / "}
                            {report.topicSlug}
                          </span>
                        )}
                      </Link>
                      <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    {description}
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.resolved ? "secondary" : "destructive"}>
                      {report.resolved ? "Закрыт" : "Открыт"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <form action={toggleResolved.bind(null, report.id, report.resolved)}>
                      <Button variant="ghost" size="sm" type="submit">
                        {report.resolved ? "Открыть" : "Закрыть"}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
