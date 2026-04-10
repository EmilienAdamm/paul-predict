# API

Backend Fastify du projet.

## Commandes utiles

```bash
bun run dev
bun run check-types
bun run build
```

## Drizzle Kit

Variables d'environnement attendues dans `apps/api/.env`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

Commandes disponibles:

```bash
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
```
