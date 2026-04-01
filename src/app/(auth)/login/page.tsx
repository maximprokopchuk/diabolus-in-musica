"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/layout/logo";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push("/lessons");
      router.refresh();
    }
  }

  return (
    <Card className="shadow-xl shadow-black/5 ring-1 ring-foreground/8 dark:shadow-black/40">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Logo className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">Вход</CardTitle>
        <CardDescription className="text-sm">Войдите в свой аккаунт</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Button
          variant="outline"
          className="w-full gap-2 h-9 transition-all duration-200 hover:bg-muted/60 hover:shadow-sm active:scale-[0.99]"
          disabled={googleLoading}
          onClick={() => {
            setGoogleLoading(true);
            signIn("google", { callbackUrl: "/lessons" });
          }}
        >
          <GoogleIcon className="size-4 shrink-0" />
          {googleLoading ? "Перенаправление..." : "Войти через Google"}
        </Button>

        <div className="relative my-5 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">или</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/8 rounded-lg px-3 py-2 animate-in fade-in duration-200">
              {error}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="h-9 transition-shadow duration-200 focus-visible:shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="h-9 transition-shadow duration-200 focus-visible:shadow-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-9 font-medium transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
            disabled={loading}
          >
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-5">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
          >
            Зарегистрироваться
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
