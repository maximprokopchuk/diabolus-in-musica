export const LEVEL_ORDER = { beginner: 0, intermediate: 1, advanced: 2 } as const;
export type Level = keyof typeof LEVEL_ORDER;

const LEVEL_CONFIG: Record<Level, { label: string; classes: string }> = {
  beginner: {
    label: "Базовый",
    classes:
      "text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700 dark:bg-emerald-950/40",
  },
  intermediate: {
    label: "Средний",
    classes:
      "text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-600 dark:bg-amber-950/40",
  },
  advanced: {
    label: "Продвинутый",
    classes: "text-primary border-primary/40 bg-primary/5 dark:bg-primary/10",
  },
};

export function LevelBadge({ level }: { level: string }) {
  const config = LEVEL_CONFIG[level as Level] ?? LEVEL_CONFIG.beginner;
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border leading-none ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
