"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, ClipboardList, ExternalLink, Trash2 } from "lucide-react";
import { toggleResolved, deleteReport } from "./actions";

type Report = {
  id: string;
  lessonSlug: string;
  topicSlug: string | null;
  description: string;
  pageUrl: string | null;
  resolved: boolean;
  createdAt: Date;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "resolved", label: "Закрытые" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "open", label: "Сначала открытые" },
  { value: "resolved", label: "Сначала закрытые" },
];

export function ErrorReportsTable({ reports: initial }: { reports: Report[] }) {
  const [reports, setReports] = useState(initial);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const total = reports.length;
  const openCount = reports.filter((r) => !r.resolved).length;
  const resolvedCount = reports.filter((r) => r.resolved).length;

  const filtered = useMemo(() => {
    let list = reports;
    if (status === "open") list = list.filter((r) => !r.resolved);
    if (status === "resolved") list = list.filter((r) => r.resolved);

    return [...list].sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "open") return Number(a.resolved) - Number(b.resolved);
      if (sort === "resolved") return Number(b.resolved) - Number(a.resolved);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reports, status, sort]);

  async function handleToggle(id: string, resolved: boolean) {
    await toggleResolved(id, resolved);
    setReports((prev) =>
      prev.map((r) => r.id === id ? { ...r, resolved: !r.resolved } : r)
    );
  }

  async function handleDelete(id: string) {
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  }

  const stats = [
    { label: "Всего репортов", value: total, icon: ClipboardList },
    { label: "Открытых", value: openCount, icon: AlertCircle },
    { label: "Закрытых", value: resolvedCount, icon: CheckCircle2 },
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

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">Статус:</span>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors cursor-pointer ${
                status === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-sm text-muted-foreground">Сортировка:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors cursor-pointer ${
                sort === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <CheckCircle2 className="h-12 w-12 opacity-30" />
          <p className="text-lg font-medium">Репортов нет</p>
          <p className="text-sm">
            {status !== "all"
              ? "Попробуйте изменить фильтр."
              : "Когда пользователи сообщат об ошибках — они появятся здесь."}
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
            {filtered.map((report) => {
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleToggle(report.id, report.resolved)}
                      >
                        {report.resolved ? "Открыть" : "Закрыть"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
