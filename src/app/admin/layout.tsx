import Link from "next/link";
import { BookOpen, Users, Settings, AlertCircle } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unresolvedCount = await db.errorReport.count({ where: { resolved: false } });

  const adminNav = [
    { href: "/admin", label: "Обзор", icon: Settings, badge: null },
    { href: "/admin/lessons", label: "Уроки", icon: BookOpen, badge: null },
    { href: "/admin/users", label: "Пользователи", icon: Users, badge: null },
    {
      href: "/admin/error-reports",
      label: "Репорты ошибок",
      icon: AlertCircle,
      badge: unresolvedCount > 0 ? unresolvedCount : null,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)]">
      {/* Mobile nav — horizontal scrollable strip */}
      <nav className="md:hidden flex overflow-x-auto gap-1 border-b px-3 py-2 shrink-0">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors shrink-0 relative"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
            {item.badge !== null && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 border-r p-4 shrink-0">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
          Админ-панель
        </h2>
        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== null && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-medium text-destructive-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 p-4 md:p-6 min-w-0">{children}</div>
    </div>
  );
}
