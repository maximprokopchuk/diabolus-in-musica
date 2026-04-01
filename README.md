# Diabolus in Musica

Приложение для изучения теории музыки с AI-ассистентом. Уроки по инструментам, интерактивный чат, трекинг прогресса.

## Стек

- Next.js 16 (App Router) + TypeScript
- Neon (serverless PostgreSQL) + Prisma
- NextAuth.js (Google OAuth + credentials)
- OpenRouter AI (Gemini Flash)
- Tailwind CSS

## Запуск локально

```bash
npm install
cp .env.example .env.local  # заполни переменные
npx prisma db push
npm run dev
```

## Переменные окружения

```
DATABASE_URL=
DIRECT_DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
OPENROUTER_API_KEY=
AI_MODEL=google/gemini-2.0-flash-001
GOOGLE_CLIENT_ID=      # опционально
GOOGLE_CLIENT_SECRET=  # опционально
```

## Деплой

Vercel + Neon. Добавь переменные окружения в настройках проекта на Vercel, установи `NEXTAUTH_URL` на production-домен.

Для Google OAuth добавь в [Google Cloud Console](https://console.cloud.google.com/) redirect URI:
```
https://твой-домен.vercel.app/api/auth/callback/google
```
