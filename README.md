# Diabolus in Musica

Приложение для обучения теории музыки для гитаристов.

## Запуск

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev -- -p 8000
```

## Настройка Google OAuth

1. Перейди в [Google Cloud Console](https://console.cloud.google.com/)
2. Создай проект (или выбери существующий)
3. Перейди в **APIs & Services → Credentials**
4. Нажми **Create Credentials → OAuth client ID**
5. Тип: **Web application**
6. Название: `Diabolus in Musica`
7. **Authorized JavaScript origins**: `http://localhost:8000`
8. **Authorized redirect URIs**: `http://localhost:8000/api/auth/callback/google`
9. Скопируй **Client ID** и **Client Secret**
10. Впиши их в `.env.local`:

```
GOOGLE_CLIENT_ID="твой-client-id"
GOOGLE_CLIENT_SECRET="твой-client-secret"
```

11. Перезапусти dev-сервер

> Для продакшена добавь домен Vercel в origins и redirect URIs.

## Аккаунт администратора

```
Email: admin@diabolus.local
Пароль: admin123
```
