"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">Что-то пошло не так</h2>
      <p className="text-muted-foreground max-w-sm">
        Произошла непредвиденная ошибка. Попробуйте обновить страницу.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="inline-flex items-center h-9 px-4 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
