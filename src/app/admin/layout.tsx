import Link from "next/link";
import { BookOpen, Users, Settings } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Обзор", icon: Settings },
  { href: "/admin/lessons", label: "Уроки", icon: BookOpen },
  { href: "/admin/users", label: "Пользователи", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="w-56 border-r p-4 hidden md:block">
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
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
