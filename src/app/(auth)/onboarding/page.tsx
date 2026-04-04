"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ChevronLeft } from "lucide-react";

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

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState<"instrument" | "level">("instrument");
  const [instrument, setInstrument] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Redirect if already onboarded
  if ((session?.user as { onboardingCompleted?: boolean })?.onboardingCompleted) {
    router.replace("/lessons");
    return null;
  }

  async function handleFinish(skipLevel = false) {
    setSaving(true);
    setSaveError(null);
    const payload: Record<string, unknown> = { preferredLevel: skipLevel ? null : level };
    // Only include instrument if user actually selected one
    if (instrument !== null) payload.preferredInstrument = instrument;
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(`Ошибка ${res.status}: ${data.error ?? "неизвестная ошибка"}`);
        setSaving(false);
        return;
      }
      await update();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Сетевая ошибка");
      setSaving(false);
      return;
    }
    window.location.href = "/lessons";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="h-10 w-10 text-primary" />
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className={`h-2 w-8 rounded-full transition-colors duration-300 ${step === "instrument" ? "bg-primary" : "bg-primary/40"}`} />
          <div className={`h-2 w-8 rounded-full transition-colors duration-300 ${step === "level" ? "bg-primary" : "bg-muted"}`} />
        </div>

        {saveError && (
          <p className="text-sm text-destructive text-center mb-4 bg-destructive/10 rounded-lg px-3 py-2">{saveError}</p>
        )}

        {step === "instrument" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-200">
            <h1 className="text-2xl font-bold mb-1 text-center">Добро пожаловать!</h1>
            <p className="text-muted-foreground mb-8 text-center">На чём вы играете?</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {INSTRUMENTS.slice(0, 4).map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => setInstrument(inst.id)}
                  className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border text-center transition-all duration-150 active:scale-95 ${
                    instrument === inst.id
                      ? "border-primary bg-primary/10 text-foreground scale-[1.02] shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-3xl">{inst.emoji}</span>
                  <span className="font-medium text-sm">{inst.label}</span>
                </button>
              ))}
              {(() => {
                const inst = INSTRUMENTS[4];
                return (
                  <button
                    key={inst.id}
                    onClick={() => setInstrument(inst.id)}
                    className={`col-span-2 flex items-center justify-center gap-3 px-4 py-4 rounded-xl border text-center transition-all duration-150 active:scale-95 ${
                      instrument === inst.id
                        ? "border-primary bg-primary/10 text-foreground scale-[1.02] shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="text-2xl">{inst.emoji}</span>
                    <span className="font-medium">{inst.label}</span>
                  </button>
                );
              })()}
            </div>
            <Button className="w-full" disabled={!instrument} onClick={() => setStep("level")}>
              Далее
            </Button>
            <button
              onClick={() => handleFinish(true)}
              disabled={saving}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors block text-right w-full pr-1"
            >
              Пропустить
            </button>
          </div>
        )}

        {step === "level" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <button
              onClick={() => setStep("instrument")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Назад
            </button>
            <h1 className="text-2xl font-bold mb-1 text-center">Ваш уровень?</h1>
            <p className="text-muted-foreground mb-8 text-center">Это поможет выбрать подходящие уроки</p>
            <div className="grid grid-cols-1 gap-3 mb-8">
              {LEVELS.map((lvl, i) => (
                <button
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all duration-150 active:scale-[0.99] ${
                    level === lvl.id
                      ? "border-primary bg-primary/10 scale-[1.01] shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 3 }).map((_, dot) => (
                      <div key={dot} className={`h-2 w-2 rounded-full ${dot <= i ? "bg-primary" : "bg-muted"}`} />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{lvl.label}</p>
                    <p className="text-xs text-muted-foreground">{lvl.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button className="w-full" disabled={!level || saving} onClick={() => handleFinish()}>
              {saving ? <><Spinner className="h-4 w-4 mr-2" />Сохранение...</> : "Начать"}
            </Button>
            <button
              onClick={() => handleFinish(true)}
              disabled={saving}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors block text-right w-full pr-1"
            >
              Пропустить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
