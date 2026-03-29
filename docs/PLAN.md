# Diabolus in Musica — План реализации

## Контекст

Приложение для обучения теории музыки, ориентированное на гитаристов (с возможностью расширения на другие инструменты). Включает уроки с теорией и картинками, AI-ассистента (Gemini Flash через OpenRouter), админку для управления контентом, авторизацию и трекинг прогресса. Хостинг — Vercel.

## Стек

- **Фреймворк**: Next.js 14+ (App Router) + TypeScript
- **БД**: Neon (serverless PostgreSQL) + Prisma ORM
- **Auth**: NextAuth.js v4 (Credentials + Google OAuth, JWT-сессии)
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: OpenRouter API (openai SDK) — модель задаётся через env `AI_MODEL`
- **Файлы**: Vercel Blob Storage (prod), `public/uploads/` (dev)
- **Валидация**: Zod

## Структура проекта

```
src/
├── app/
│   ├── (public)/lessons/[lessonSlug]/[topicSlug]/  — просмотр теории + AI чат
│   ├── (auth)/login, register/                     — авторизация
│   ├── (dashboard)/profile, progress/              — личный кабинет
│   ├── admin/lessons, topics, users/               — админка
│   └── api/auth, lessons, topics, theory-blocks, progress, chat, upload/
├── components/ui, layout, lessons, chat, admin, auth, progress/
├── lib/db.ts, auth.ts, ai/{client,config,prompts}.ts, validators/, upload.ts
├── hooks/use-chat.ts, use-progress.ts
└── types/index.ts
prisma/schema.prisma, seed.ts
```

## Схема БД (Prisma)

- **User** — id, name, email, hashedPassword, role (USER/ADMIN), связи с Account/Session/Progress/Chat
- **Account, Session, VerificationToken** — стандартные модели NextAuth
- **Lesson** — title, slug, description, instrument (enum: GUITAR/BASS/PIANO/UKULELE/GENERAL), order, published, imageUrl
- **Topic** — lessonId, title, slug (unique per lesson), description, order
- **TheoryBlock** — topicId, type (TEXT/IMAGE/NOTATION/CODE_EXAMPLE), content (markdown/URL), order, metadata (JSON)
- **UserProgress** — userId, topicId, completed, completedAt (unique [userId, topicId])
- **ChatMessage** — userId, topicId, role, content, createdAt

## API маршруты

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET/POST | `/api/lessons` | Список / создание | Public / Admin |
| GET/PUT/DELETE | `/api/lessons/[id]` | CRUD урока | Public / Admin |
| GET/POST | `/api/topics` | Список / создание | Public / Admin |
| GET/PUT/DELETE | `/api/topics/[id]` | CRUD темы | Public / Admin |
| PUT | `/api/topics/reorder` | Переупорядочивание | Admin |
| GET/POST | `/api/theory-blocks` | Список / создание | Public / Admin |
| PUT/DELETE | `/api/theory-blocks/[id]` | CRUD блока | Admin |
| PUT | `/api/theory-blocks/reorder` | Переупорядочивание | Admin |
| GET/POST | `/api/progress` | Прогресс пользователя | Auth |
| POST | `/api/chat` | Стриминг AI-чат | Auth |
| GET | `/api/chat?topicId=xxx` | История чата | Auth |
| POST | `/api/upload` | Загрузка изображений | Admin |

## AI интеграция

- **`lib/ai/config.ts`** — модель и параметры через env (`AI_MODEL=google/gemini-flash-1.5`)
- **`lib/ai/client.ts`** — openai SDK с `baseURL: openrouter.ai/api/v1` (сменить провайдера = сменить baseURL)
- **`lib/ai/prompts.ts`** — системные промпты: генерация теории (для админки) и чат (контекст = блоки теории текущей темы)
- Чат стримится через `POST /api/chat`, история сохраняется в БД

## Фазы реализации

### Фаза 1: Фундамент ✅
- Инициализация Next.js + Tailwind + shadcn/ui
- Prisma-схема, миграция, seed (админ + пример уроков)
- NextAuth (Credentials + Google), middleware для защиты роутов
- Корневой layout: header, footer

### Фаза 2: Админка
- CRUD уроков, тем, блоков теории (страницы + API)
- Drag-and-drop сортировка (@dnd-kit)
- Загрузка изображений (Vercel Blob)
- Управление пользователями

### Фаза 3: Публичная часть + прогресс
- Каталог уроков с фильтром по инструменту
- Страница урока → список тем → просмотр теории
- TheoryBlockRenderer (markdown, изображения)
- Кнопка "Пройдено", дашборд прогресса

### Фаза 4: AI
- OpenRouter клиент (openai SDK)
- Стриминговый чат на странице темы + сохранение истории
- Генерация черновика теории в админке
- Rate limiting

### Фаза 5: Продакшен
- Responsive, dark mode, loading states
- SEO (metadata, OG, sitemap)
- Деплой на Vercel + Neon

## Переменные окружения

```
DATABASE_URL, DIRECT_DATABASE_URL          # Neon
NEXTAUTH_URL, NEXTAUTH_SECRET             # Auth
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET    # OAuth
OPENROUTER_API_KEY, AI_MODEL              # AI
BLOB_READ_WRITE_TOKEN                     # Файлы (prod)
```

## Верификация

1. `npm run dev` — приложение запускается без ошибок
2. Регистрация/логин работают, сессия сохраняется
3. Админ создаёт урок → тему → блоки теории → публикует
4. Пользователь видит урок в каталоге, читает теорию, отмечает прогресс
5. AI-чат стримит ответы, история сохраняется между сессиями
6. `npx prisma studio` — данные корректны в БД
