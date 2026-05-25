# Журнал работ на строительном объекте

Внутренний инструмент для прораба — учёт выполненных работ на объекте по дням.

## Стек

| Слой | Технология | Причина выбора |
|---|---|---|
| **Фронтенд** | React 18 + TypeScript + Vite | Требование задания; Vite — быстрый dev-сервер и сборка |
| **Бэкенд** | Node.js + Express + TypeScript | Минимальный overhead, быстрая разработка API |
| **ORM** | Prisma | Типобезопасные запросы, автомиграции, удобный seed |
| **База данных** | PostgreSQL 16 | Надёжная реляционная БД, хорошо работает с Prisma |
| **Валидация** | Zod + react-hook-form | Единая схема валидации на фронте и бэке |
| **Контейнеризация** | Docker Compose | Одна команда для запуска всего окружения |

## Функциональность

- Список записей журнала с колонками: дата, вид работ, объём + единица, ФИО исполнителя
- Фильтрация по диапазону дат и сортировка (новые / старые первыми)
- Добавление записи через модальную форму с валидацией
- **Редактирование** существующей записи
- Удаление записи с подтверждением
- **Справочник видов работ** — выбор из предзаполненного списка (12 видов работ, хранятся в таблице БД)

## Быстрый старт

### Вариант 1 — Docker Compose (рекомендуется)

```bash
git clone <repo-url>
cd construction-journal
docker compose up --build
```

Приложение будет доступно на **http://localhost:3000**

### Вариант 2 — локальный запуск

Требования: Node.js 20+, PostgreSQL 16

**База данных:**
```bash
# Создайте БД и задайте DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost:5432/journal"
```

**Бэкенд:**
```bash
cd backend
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
# Сервер на http://localhost:4000
```

**Фронтенд:**
```bash
cd frontend
npm install
npm run dev
# Приложение на http://localhost:5173
```

## Структура проекта

```
construction-journal/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Модели БД
│   │   ├── seed.ts             # Начальные виды работ
│   │   └── migrations/
│   └── src/
│       ├── index.ts            # Express app
│       ├── db.ts               # Prisma client
│       └── routes/
│           ├── entries.ts      # CRUD журнала
│           └── workTypes.ts    # Справочник видов работ
├── frontend/
│   └── src/
│       ├── api/client.ts       # HTTP-клиент
│       ├── components/         # React-компоненты
│       ├── hooks/              # useEntries, useWorkTypes
│       └── types/              # TypeScript-типы
└── docker-compose.yml
```

## API

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/entries` | Список записей (параметры: `dateFrom`, `dateTo`, `sortOrder`) |
| POST | `/api/entries` | Создать запись |
| PUT | `/api/entries/:id` | Обновить запись |
| DELETE | `/api/entries/:id` | Удалить запись |
| GET | `/api/work-types` | Справочник видов работ |
