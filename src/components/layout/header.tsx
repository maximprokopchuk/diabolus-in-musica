"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Music, LogOut, User, BarChart3, Settings } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Music className="h-5 w-5" />
          <span>Diabolus in Musica</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/lessons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Уроки
          </Link>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-8 w-8 rounded-full" />}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-muted-foreground text-xs">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profile" />}>
                  <User className="mr-2 h-4 w-4" />Профиль
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/progress" />}>
                  <BarChart3 className="mr-2 h-4 w-4" />Прогресс
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/admin" />}>
                      <Settings className="mr-2 h-4 w-4" />Админка
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Войти
              </Button>
              <Button size="sm" render={<Link href="/register" />}>
                Регистрация
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
