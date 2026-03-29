import type { Topic, TheoryBlock, Lesson } from "@prisma/client";

export function buildChatSystemPrompt(
  topic: Topic & { lesson: Lesson; theoryBlocks: TheoryBlock[] }
): string {
  const theoryContent = topic.theoryBlocks
    .filter((b) => b.type === "TEXT")
    .sort((a, b) => a.order - b.order)
    .map((b) => b.content)
    .join("\n\n");

  return `Ты — опытный преподаватель теории музыки, специализирующийся на ${instrumentName(topic.lesson.instrument)}.
Сейчас ученик изучает тему "${topic.title}" из урока "${topic.lesson.title}".

Вот теоретический материал этой темы:
---
${theoryContent}
---

Правила:
- Отвечай на русском языке
- Давай точные, понятные объяснения
- Приводи музыкальные примеры, когда это уместно
- Если ученик спрашивает о чём-то за пределами текущей темы, кратко ответь и предложи изучить соответствующий урок
- Используй markdown для форматирования`;
}

export function buildTheoryGenerationPrompt(
  topicTitle: string,
  lessonTitle: string,
  instrument: string
): string {
  return `Ты — автор учебника по теории музыки для ${instrumentName(instrument)}.
Напиши подробный теоретический материал для темы "${topicTitle}" из урока "${lessonTitle}".

Требования:
- Пиши на русском языке
- Используй markdown
- Начни с определения/введения
- Объясни теорию с примерами
- Если применимо — дай практические примеры для ${instrumentName(instrument)}
- Длина: 500-1500 слов`;
}

function instrumentName(instrument: string): string {
  const names: Record<string, string> = {
    GUITAR: "гитара",
    BASS: "бас-гитара",
    PIANO: "фортепиано",
    UKULELE: "укулеле",
    GENERAL: "музыка (общее)",
  };
  return names[instrument] || instrument;
}
