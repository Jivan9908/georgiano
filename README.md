# Georgiano

Production-oriented Next.js foundation for Georgiano, a premium Georgian restaurant experience in North Hollywood, California.

## Current scope

Stages 1–4 contain the approved public website, Stage 5 adds the backend foundation, and Stage 6 adds the secured administration system. Menu, homepage, gallery, settings, reservations, and inquiry records can now be managed through `/admin`; approved public menu and homepage reads use the database when `DATABASE_URL` is configured. Public form persistence, real availability, ordering, payments, email, and deployment remain outside this stage.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- PostgreSQL
- Prisma ORM with the `pg` driver adapter
- Zod server-input validation
- Argon2id password hashing and database-backed admin sessions
- Vercel Blob-compatible media storage with a local development adapter
- Vitest
- Tailwind CSS 4 and Motion
- pnpm

## Local application development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Admin setup

The application never creates a default administrator automatically. After migrations are applied, create the first administrator explicitly with one-time environment values:

```bash
ADMIN_EMAIL="admin@example.com" \
ADMIN_NAME="Administrator" \
ADMIN_PASSWORD="use-a-unique-password-of-at-least-14-characters" \
pnpm admin:bootstrap
```

The command refuses to overwrite an existing account and never prints the password. Do not commit these values. Open `http://localhost:3000/admin/login` after creation.

Admin sessions use a random opaque token. Only its SHA-256 hash is stored in PostgreSQL; the browser receives an `httpOnly`, `SameSite=Strict` cookie that is `Secure` in production and expires after 12 hours. Login attempts are rate-limited using hashed IP identifiers. Every administrative mutation rechecks the server session, validates explicit fields, and writes an audit record.

## PostgreSQL setup

1. Create an empty PostgreSQL database and a dedicated local user. Do not use production credentials.
2. Copy the documented variable names and add your real local value to an ignored `.env.local` or `.env` file:

```bash
cp .env.example .env.local
```

3. Set `DATABASE_URL` to the local database connection string.
4. Apply the checked-in migrations and seed clearly marked development data:

```bash
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
```

For a new schema change during development:

```bash
pnpm db:migrate:dev --name describe_the_change
pnpm db:generate
```

Never use `prisma db push`, `migrate reset`, or destructive SQL as a substitute for a reviewed migration on shared data.

## Hosted PostgreSQL later

Provision any PostgreSQL-compatible service, store its connection string as the server-only `DATABASE_URL`, and run:

```bash
pnpm db:migrate:deploy
pnpm db:seed
```

Run the seed only in an environment where the clearly labeled development records are wanted. No credentials are committed, and `DATABASE_URL` must never use the `NEXT_PUBLIC_` prefix.

## Database architecture

The Prisma schema lives in `prisma/schema.prisma`. Reviewed SQL migrations live in `prisma/migrations`, including the Stage 5 foundation and the additive Stage 6 admin identity/session migration.

- Menu categories and items have stable slugs, explicit ordering and visibility controls.
- Dietary tags and allergens are normalized many-to-many relations. The Stage 5 seed intentionally creates no dietary or allergen claims.
- Homepage content uses typed section keys plus structured, ordered content blocks instead of an uncontrolled CMS blob.
- Business hours, reservation windows, closures, special hours, and capacity rules are structured for future availability calculations.
- Money is stored as integer cents. Migration-level checks protect non-negative values and order arithmetic.
- Order items keep name and price snapshots so later menu edits cannot rewrite history.
- Audit logs retain a human-readable actor identifier and an optional foreign key to the admin identity.

## Media storage

Accepted admin uploads are JPEG, PNG, WebP, or AVIF files up to 5 MB. With `BLOB_READ_WRITE_TOKEN`, uploads use Vercel Blob. Without that token, development uploads are stored under ignored `public/uploads`. Production intentionally fails closed when Blob is not configured. Existing safe root-relative paths and `http(s)` image URLs can also be entered in admin forms.

## Timezone strategy

- Absolute events such as `reservationAt`, `pickupAt`, and audit timestamps use PostgreSQL `TIMESTAMPTZ` and are handled as UTC instants.
- Georgiano's confirmed business timezone is stored explicitly as `America/Los_Angeles`.
- Calendar-only business concepts use PostgreSQL `DATE`.
- Repeating service windows use day-of-week plus integer minutes after local midnight. This avoids inventing UTC offsets and allows a future availability service to resolve daylight saving time for each date.
- The future availability engine must combine the local date, service-window minutes, and the IANA timezone before producing a UTC instant.

## Validation and trust boundaries

Zod schemas in `src/lib/validation` validate menu, settings, reservations, inquiries, and future order inputs. Client validation is treated only as user experience; server entry points must validate again before calling repositories.

Prisma and database credentials are isolated under `src/lib/server` with `server-only` guards. React components must not import the generated Prisma client or repositories directly from client components. Repository errors are logged for development context and converted to a stable `DataAccessError` instead of exposing raw database errors.

Public reads exclude hidden menu records and invisible content. Administrative mutations revalidate the affected public and admin routes so changes are visible without spreading cache logic throughout the UI.

## Seed strategy

`prisma/seed.ts` is repeatable:

- categories and menu items are upserted from the existing Stage 3 development menu;
- prices remain explicitly development-only data;
- no dietary or allergen relations are seeded;
- no address, phone, email, social URL, hours, capacity, tax rate, or policy is invented;
- reservations and ordering start disabled;
- homepage and gallery records are published but clearly labeled development content.

## Verification

```bash
pnpm db:validate
pnpm db:generate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run the application checks together with:

```bash
pnpm check
```

Database-connected verification additionally requires a valid development `DATABASE_URL`:

```bash
pnpm db:migrate:deploy
pnpm db:seed
```

## Source organization

```text
prisma/
├── migrations/          Reviewed PostgreSQL migration history
├── schema.prisma        Relational data model
└── seed.ts              Repeatable development seed
src/
├── app/                 App Router routes and styles
├── components/          Approved public presentation
├── generated/prisma/    Generated Prisma client
└── lib/
    ├── domain/           Pure business invariants
    ├── server/           Server-only database and repositories
    └── validation/       Zod input schemas
tests/                   Backend validation and domain tests
```

Static brand assets live in `public/brand`. The supplied Georgiano logo remains preserved without modification.
