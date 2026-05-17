---
applyTo: '**'
---

# Recommended Project Structure

This is the recommended layout for a Playwright TypeScript test framework that covers both **API** and **UI** testing. Use this as the target structure when scaffolding a new project or extending an existing one.

---

## Directory Layout

```
config/
  env.config.ts       # Load and export env variables (BASE_URL, credentials) via dotenv
  global.setup.ts     # Global Playwright setup hook (e.g. health checks before all tests)

src/
  merge.fixture.ts    # Merged fixture entry-point — combines all fixture extensions
  api/
    assertions/       # Shared reusable API assertion helpers
    data/             # Static arrays and generator functions for data-driven tests
    factories/        # Payload builders (use faker, return typed interfaces)
    fixtures/         # Playwright API fixture extensions
    models/           # TypeScript interfaces for API payloads and responses
    requests/         # BaseRequest + resource-specific request classes
    utils/            # API URL constants, shared helpers (e.g. timestamp())
  ui/
    components/       # Reusable UI components shared across pages
    factories/        # Random data generators for UI models (use faker)
    fixtures/         # Playwright UI fixture extensions
    models/           # TypeScript interfaces for UI data models
    pages/            # Page Object classes (extend BasePage)
    test-data/        # Static test data files (pre-registered users, invalid inputs)
    utils/            # UI-specific helpers (wait utilities, etc.)
    views/            # View Objects for modals, dialogs, inline forms (no URL)

tests/
  api/
    <resource>-crud/  # CRUD specs per resource
    health/           # Health check (must pass before other tests run)
    smokes/           # Quick sanity checks across all resources
    <validation>/     # Validation/boundary test specs
  ui/
    end-to-end/       # Serial lifecycle flows (create → verify → delete)
    integration/      # Feature-level tests per page or component
    setup/            # Auth setup specs that save session state
    smoke/            # Quick UI sanity checks

tmp/                  # Git-ignored runtime artefacts (session storage state files)
```

---

## Path Aliases

Configure path aliases in `tsconfig.json` to avoid relative import hell:

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@_config/*": ["config/*"],
      "@_pw-config": ["playwright.config.ts"],
      "@_src/*":     ["src/*"]
    }
  }
}
```

All internal imports use these aliases. Relative paths (`../../`) are not used in `src/` or `tests/`.

---

## Environment Variables

Use `dotenv` to load variables from a `.env` file at the project root (not checked in). Wrap each variable in a guard function that throws if it is missing:

```typescript
// config/env.config.ts
import * as dotenv from 'dotenv';
dotenv.config({ override: true, quiet: true });

function requireEnvVariable(name: string): string {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Environment variable ${name} is not set.`);
  return value;
}

export const BASE_URL      = requireEnvVariable('BASE_URL');
export const USER_EMAIL    = requireEnvVariable('USER_EMAIL');
export const USER_PASSWORD = requireEnvVariable('USER_PASSWORD');
```

Provide a `.env-template` (checked in) listing all required variables with empty values or descriptions.

---

## Playwright Configuration

Key `playwright.config.ts` decisions:

- Set `testDir: './tests'`
- Use `globalSetup` pointing to `config/global.setup.ts` for a health check that gates all other tests
- Define **projects** to separate concerns:
  - `health` — runs `*.health.ts` first, all other projects depend on it
  - `api` — runs `tests/api/`, depends on `health`
  - `chromium-non-logged` — UI tests without auth (grep-inverts `@logged` tag)
  - `setup` — runs `*.setup.ts`, saves session state to `tmp/session.json`
  - `chromium-logged` — UI tests requiring auth (grep `@logged`), depends on `setup`, uses saved `storageState`
- Store session state path as an exported constant: `export const STORAGE_STATE = path.join(__dirname, 'tmp/session.json')`

---

## Merged Fixture Entry-Point

Create `src/merge.fixture.ts` to combine all fixture extensions into a single import:

```typescript
// src/merge.fixture.ts
import { requestObjectTest } from '@_src/api/fixtures/request-object.fixture';
import { pageObjectTest }    from '@_src/ui/fixtures/page-object.fixture';
// import additional fixture extensions here as your project grows
import { mergeTests }        from '@playwright/test';

export const test = mergeTests(pageObjectTest, requestObjectTest);
export { expect } from '@playwright/test';
```

All test files import `test` and `expect` from this single file.

---

## Tooling Setup

### ESLint (`eslint.config.mjs`)

Required plugins: `@eslint/js`, `typescript-eslint`, `eslint-plugin-playwright`, `eslint-plugin-prettier`.

Key rules:
- `no-console: 'error'`
- `@typescript-eslint/explicit-function-return-type: 'error'`
- `playwright/no-nested-step: 'off'` (nested steps are allowed)
- Register test aliases in playwright plugin settings (e.g. `test: ['setup', 'health']`)

### Prettier (`.prettierrc.json`)

```json
{
  "singleQuote": true,
  "endOfLine": "auto",
  "tabWidth": 2,
  "semi": true,
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "plugins": ["@trivago/prettier-plugin-sort-imports"]
}
```

### Package Scripts

```json
{
  "check":         "npm run format && npm run lint && npm run tsc:check",
  "format":        "npx prettier --write .",
  "lint":          "npx eslint . --max-warnings=0",
  "tsc:check":     "npx tsc --noEmit --pretty --strict",
  "test":          "npx playwright test",
  "test:headed":   "npm run test -- --headed",
  "test:ui-mode":  "npm run test -- --ui",
  "show-report":   "npx playwright show-report"
}
```

Run `npm run check` before every commit (enforce with Husky).

---

## Test Tags Convention

Tags are embedded in test title strings:

- `@TAG-R*-*` — requirement reference, on individual `test()` calls
- `@logged` — test requires authenticated session (routes to logged project)
- `@crud`, `@create`, `@delete`, `@modify` — operation category
- `@predefined_data` — test depends on pre-seeded data in the target environment


---

## Directory Layout

```
config/               # Environment config and global setup
  env.config.ts       # Exports BASE_URL, USER_EMAIL, USER_PASSWORD from .env
  global.setup.ts     # Global setup hook

src/
  merge.fixture.ts    # Merged fixture entry-point – import test/expect from here
  api/
    assertions/       # Shared API assertion helpers (expectGetOneResponseStatus)
    data/             # Static data arrays & generators for data-driven tests
    factories/        # Payload builders (use faker, return typed model objects)
    fixtures/         # API fixture extensions (requestObjectTest)
    models/           # TypeScript interfaces for API payloads & responses
    requests/         # Request classes (BaseRequest + derived: ArticlesRequest, etc.)
    utils/            # API helpers: apiUrls object, timestamp()
  ui/
    components/       # Reusable UI components (e.g. main-menu)
    factories/        # Random data generators for UI (prepareRandomUser, prepareRandomArticle)
    fixtures/         # UI fixture extensions (pageObjectTest, articleTest)
    models/           # TypeScript interfaces for UI models
    pages/            # Page Object classes (extend BasePage)
    test-data/        # Static test data files (user.data.ts, invalidUser.data.ts)
    utils/            # UI helpers (wait.util.ts)
    views/            # View Object classes for modal/dialog/inline views

tests/
  api/
    articles-crud/    # CRUD specs for articles API
    comments-crud/    # CRUD specs for comments API
    health/           # Health check (*.health.ts)
    smokes/           # API smoke specs
    users-validation/ # User registration validation specs
  ui/
    end-to-end/       # Serial E2E flows (article-lifecycle, comment-lifecycle)
    integration/      # Feature-level integration specs
    setup/            # Auth setup (*.setup.ts)
    smoke/            # UI smoke specs

tmp/                  # Git-ignored runtime artefacts (session.json storage state)
```

---

## Path Aliases (tsconfig.json)

| Alias | Resolves to |
|---|---|
| `@_config/*` | `config/*` |
| `@_pw-config` | `playwright.config.ts` |
| `@_src/*` | `src/*` |

**No `@fixtures`, `@assertions`, or `@pages` alias exists.** Always use the `@_src/*` prefix.

---

## Fixture Entry Point

All tests import `test` and `expect` from the **merged fixture**:

```typescript
import { expect, test } from '@_src/merge.fixture';
```

`merge.fixture.ts` calls `mergeTests(pageObjectTest, articleTest, requestObjectTest)` and re-exports `expect` from `@playwright/test`. It is the **single import for both UI and API tests**.

---

## Playwright Projects (playwright.config.ts)

| Project | Scope | Dependencies | Notes |
|---|---|---|---|
| `health` | `*.health.ts` | — | Runs first, gates everything |
| `api` | `tests/api/` | `health` | All API specs |
| `chromium-non-logged` | `tests/ui/` | `health` | UI tests without `@logged` tag |
| `setup` | `*.setup.ts` | `health` | Saves session to `tmp/session.json` |
| `chromium-logged` | `tests/ui/` (grep `@logged`) | `setup` | UI tests requiring auth |

---

## Environment Variables

Defined in `.env` (not checked in) and loaded via `dotenv` in `config/env.config.ts`:

- `BASE_URL` — application base URL
- `USER_EMAIL` — default test user email
- `USER_PASSWORD` — default test user password

---

## Test Tags Convention

Tags are appended to test titles as space-separated strings:

- `@TAG-R01-01` — requirement reference tag
- `@logged` — test requires authenticated session (routes to `chromium-logged` project)
- `@crud`, `@create`, `@delete`, `@modify` — operation category
- `@api`, `@ui` — layer tag
- `@predefined_data` — test depends on pre-seeded data

---

## Scripts

```bash
npm run check          # format + lint + tsc:check (pre-commit gate)
npm run format         # prettier --write
npm run lint           # eslint --max-warnings=0
npm run tsc:check      # tsc --noEmit --strict
npm test               # playwright test (all projects)
npm run test:tag       # run by tag grep pattern
```

---

## Linting & Formatting Rules

- **ESLint**: `no-console: error`, `@typescript-eslint/explicit-function-return-type: error`, Playwright plugin enabled (`playwright/no-nested-step: off`)
- **Prettier**: `singleQuote: true`, `tabWidth: 2`, `semi: true`, import sorting via `@trivago/prettier-plugin-sort-imports`
- **Husky**: pre-commit hook runs `npm run check`
