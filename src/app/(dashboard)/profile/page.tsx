"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle2 } from "lucide-react";

const INSTRUMENTS = [
  { id: "GUITAR", label: "Гитара", emoji: "🎸" },
  { id: "BASS", label: "Бас-гитара", emoji: "🎵" },
  { id: "DRUMS", label: "Барабаны", emoji: "🥁" },
  { id: "PIANO", label: "Фортепиано", emoji: "🎹" },
  { id: "GENERAL", label: "Общая теория", emoji: "🎼" },
];

const LEVELS = [
  { id: "beginner", label: "Новичок", desc: "Только начинаю" },
  { id: "intermediate", label: "Средний", desc: "Умею играть, хочу понять теорию" },
  { id: "advanced", label: "Продвинутый", desc: "Хочу углубить знания" },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [instrument, setInstrument] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/preferences", { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        setInstrument(data.preferredInstrument ?? null);
        setLevel(data.preferredLevel ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredInstrument: instrument, preferredLevel: level }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!session?.user) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">Профиль</h1>

      {/* User info */}
      <Card className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-400" style={{ animationDelay: "75ms" }}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">{session.user.name || "Пользователь"}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">{session.user.email}</p>
              <Badge variant="secondary" className="mt-1">
                {session.user.role === "ADMIN" ? "Администратор" : "Ученик"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Preferences */}
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-400" style={{ animationDelay: "150ms" }}>
        <CardHeader>
          <CardTitle>Настройки обучения</CardTitle>
          <CardDescription>Влияет на порядок уроков и фильтр по умолчанию</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          ) : (
            <>
              {/* Instrument */}
              <div>
                <p className="text-sm font-medium mb-3">Инструмент</p>
                <div className="grid grid-cols-2 gap-2">
                  {INSTRUMENTS.slice(0, 4).map((inst, i) => (
                    <button
                      key={inst.id}
                      onClick={() => setInstrument(inst.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm text-left transition-all animate-in fade-in zoom-in-95 duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                        instrument === inst.id
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:border-primary/40 hover:bg-muted/50 text-muted-foreground"
                      }`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="text-lg">{inst.emoji}</span>
                      <span className="font-medium">{inst.label}</span>
                      {instrument === inst.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                  {(() => {
                    const inst = INSTRUMENTS[4];
                    return (
                      <button
                        onClick={() => setInstrument(inst.id)}
                        className={`col-span-2 flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                          instrument === inst.id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-primary/40 hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <span className="text-lg">{inst.emoji}</span>
                        <span className="font-medium">{inst.label}</span>
                        {instrument === inst.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* Level */}
              <div>
                <p className="text-sm font-medium mb-3">Уровень</p>
                <div className="grid grid-cols-1 gap-2">
                  {LEVELS.map((lvl, i) => (
                    <button
                      key={lvl.id}
                      onClick={() => setLevel(lvl.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm text-left transition-all animate-in fade-in slide-in-from-bottom-1 duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                        level === lvl.id
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:border-primary/40 hover:bg-muted/50 text-muted-foreground"
                      }`}
                      style={{ animationDelay: `${180 + i * 60}ms` }}
                    >
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: 3 }).map((_, dot) => (
                          <div key={dot} className={`h-2 w-2 rounded-full ${dot <= i ? "bg-primary" : "bg-muted"}`} />
                        ))}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{lvl.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{lvl.desc}</span>
                      </div>
                      {level === lvl.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                {saved ? "✓ Сохранено" : saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
