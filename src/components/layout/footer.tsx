import { Music } from "lucide-react";

const COMMIT = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "dev";

export function Footer() {
  return (
    <footer className="border-t border-border/60 dark:border-border py-6 mt-auto">
      <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          <span>Diabolus in Musica</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Теория музыки</span>
          <span className="font-mono text-xs opacity-40">{COMMIT}</span>
        </div>
      </div>
    </footer>
  );
}
