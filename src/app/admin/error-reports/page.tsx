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
import { AlertCircle, CheckCircle2, ClipboardList, ExternalLink, Trash2 } from "lucide-react";
import { toggleResolved, deleteReport } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Репорты ошибок — Админ-панель" };

const STATUS_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "resolved", label: "Закрытые" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
];

export default async function ErrorReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>;
}) {
  const session = await getSession();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  const { status = "all", sort = "newest" } = await searchParams;

  const where =
    status === "open" ? { resolved: false } :
    status === "resolved" ? { resolved: true } :
    {};

  const reports = await db.errorReport.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
  });

  const [total, open, resolved] = await Promise.all([
    db.errorReport.count(),
    db.errorReport.count({ where: { resolved: false } }),
    db.errorReport.count({ where: { resolved: true } }),
  ]);

  const stats = [
    { label: "Всего репортов", value: total, icon: ClipboardList },
    { label: "Открытых", value: open, icon: AlertCircle },
    { label: "Закрытых", value: resolved, icon: CheckCircle2 },
  ];

  function buildUrl(params: Record<string, string>) {
    const p = new URLSearchParams({ status, sort, ...params });
    return `/admin/error-reports?${p.toString()}`;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Репорты ошибок</h1>

      {/* Stats */}
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">Статус:</span>
          {STATUS_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl({ status: opt.value })}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                status === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-sm text-muted-foreground">Сортировка:</span>
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl({ sort: opt.value })}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                sort === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <CheckCircle2 className="h-12 w-12 opacity-30" />
          <p className="text-lg font-medium">Репортов нет</p>
          <p className="text-sm">
            {status !== "all" ? "Попробуйте изменить фильтр." : "Когда пользователи сообщат об ошибках — они появятся здесь."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Дата</TableHead>
              <TableHead>Урок / Тема</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="w-24">Статус</TableHead>
              <TableHead className="w-32"></TableHead>
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
                  <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
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
                            {" / "}{report.topicSlug}
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
                    <div className="flex items-center gap-1">
                      <form action={toggleResolved.bind(null, report.id, report.resolved)}>
                        <Button variant="ghost" size="sm" type="submit" className="text-xs">
                          {report.resolved ? "Открыть" : "Закрыть"}
                        </Button>
                      </form>
                      <form action={deleteReport.bind(null, report.id)}>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </div>
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
