import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-guard";
import { ErrorReportsTable } from "./error-reports-table";

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

  return <ErrorReportsTable reports={reports} />;
}
