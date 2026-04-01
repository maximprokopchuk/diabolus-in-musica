import { Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          <span>Diabolus in Musica</span>
        </div>
        <p>Теория музыки</p>
      </div>
    </footer>
  );
}
