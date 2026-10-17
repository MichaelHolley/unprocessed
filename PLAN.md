# Unprocessed — Implementation Plan

Port the food catalogue from Know Your Food (Vue, hardcoded data) to this SvelteKit template, backed by SQLite, with an authenticated admin that creates and edits foods using AI.

## Stack

- SvelteKit (runes, remote functions, async) with `@sveltejs/adapter-node`
- Drizzle ORM + `better-sqlite3`; database file at `DATABASE_URL`
- `@tanstack/ai` + `@tanstack/ai-openrouter` for structured AI output
- Tailwind CSS v4
- Docker: `Dockerfile` + `docker-compose.yml` (app on a port, volume for the `.db` file). TLS/domain handled by the existing reverse proxy on the VPS. Drizzle migrations run on container start.

## Environment

| Variable             | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `DATABASE_URL`       | Path to the SQLite file                      |
| `ADMIN_PASSWORD`     | Admin login password (plain-text comparison) |
| `OPENROUTER_API_KEY` | OpenRouter API key                           |
| `OPENROUTER_MODEL`   | Model id; defaults to a cheap, fast model    |

Provide a `.env.example`.

## Schema

```
foods
  id        text pk (slug, e.g. 'sweet-potato')
  name      text not null
  emoji     text not null

impacts
  id        integer pk
  food_id   text fk -> foods.id (on delete cascade)
  kind      'positive' | 'negative' | 'neutral'
  text      text not null
  position  integer not null
```

- `pnpm db:seed` inserts the 16 foods from Know Your Food (`src/data/foods.ts`) into an empty database.
- Scripts: `db:generate`, `db:migrate`, `db:studio`, `db:seed`.

## Public page `/`

- Port of the Know Your Food search + card grid in Svelte: same theme (Bagel Fat One / Onest fonts, pistachio / aubergine palette, good / bad / tip colours), `ImpactMark` icons, legend, empty state with "Clear search".
- Loads all foods (with impacts ordered by `position`) once; filtering by name or impact text happens client-side.
- New foods are visible immediately (no draft/published state).

## Admin `/admin`

### Auth

- `/admin/login`: password form compared against `ADMIN_PASSWORD`; on success sets a signed, httpOnly session cookie.
- `hooks.server.ts` guards `/admin/*` (except login) and redirects to login when unauthenticated.
- Logout action clears the cookie.

### Create

- Food list plus a single **name** input with a **Generate** button.
- Server calls the AI once with structured output: emoji + 4–6 impacts with a mix of positive / negative / neutral, matching the tone and British spelling of the existing data.
- Result is **auto-saved** (slug derived from name), then the admin is redirected to the edit page.
- Duplicate slug is rejected with an error.

### Edit `/admin/[id]`

- Edit name, emoji, and each existing impact's text and kind.
- **Regenerate impacts**: re-run the AI and replace all impact rows for the food.
- **Delete** food with confirmation (impacts cascade).
- Out of scope: adding/removing individual impacts, reordering impacts.

## Conventions

- Remote functions (`query` / `form` / `command`) for data access and mutations.
- Validate with `pnpm run check`. No tests (per `AGENTS.md`).
