---
applyTo: '**'
---

# Copilot Instructions

This is a **Playwright TypeScript test automation framework** for both API and UI testing. The framework follows the **Page Object Model** for UI and a **Request Object Model** for API, with a shared fixture entry-point that merges all fixture extensions.

## Instruction Files

Read the relevant file before writing or modifying any code:

| File | When to read |
|---|---|
| [project-structure.instructions.md](./project-structure.instructions.md) | Starting a project, adding new directories, setting up config |
| [playwright-cli.instructions.md](./playwright-cli.instructions.md) | Exploring a live UI or interacting with a browser |
| [page-object-pattern.instructions.md](./page-object-pattern.instructions.md) | Creating or modifying page objects, view objects, or UI fixtures |
| [locator-strategy.instructions.md](./locator-strategy.instructions.md) | Choosing or reviewing element selectors |
| [test-structure.instructions.md](./test-structure.instructions.md) | Writing any test file (UI or API), setting up fixtures |
| [api-pattern.instructions.md](./api-pattern.instructions.md) | Creating or modifying request classes, models, factories, or API fixtures |
| [data-driven-tests.instructions.md](./data-driven-tests.instructions.md) | Writing data-driven tests with `.forEach()`, generators, or skip/annotation |

---

## Core Design Decisions

### Single fixture entry-point

Create `src/merge.fixture.ts` using `mergeTests()`. All test files import `test` and `expect` from it — never from `@playwright/test` directly in test files. This gives every test access to both UI page object fixtures and API request fixtures.

### Page Object Model (UI)

Page objects live in `src/ui/pages/`, extend `BasePage`, declare locators as class properties, and initialize them in the constructor. Methods that cause navigation return the new page object. View objects for modals/dialogs live in `src/ui/views/` and do not extend `BasePage`.

### Request Object Model (API)

Request classes live in `src/api/requests/`, extend `BaseRequest`, and expose one method per HTTP verb. Models are TypeScript interfaces. Factories produce typed payloads using faker. Auth is injected via an optional `headers` constructor parameter.

### Data-Driven Tests

Use `.forEach()` over a typed array of test cases. Static arrays for simple value sets; generator functions (iterating over `Object.keys(payload)`) for field-level validation suites. Skip known-broken cases with `test.skip()` + an annotation rather than deleting them.

### Path Aliases

Configure `@_config/*`, `@_pw-config`, and `@_src/*` in `tsconfig.json`. Use them everywhere — no relative paths in `src/` or `tests/`.


## Critical Rules (always apply)

### Imports — never get these wrong

```typescript
// ✅ CORRECT — always import test and expect from the merged fixture
import { expect, test } from '@_src/merge.fixture';

// ❌ WRONG — never import directly from @playwright/test in test files
import { test } from '@playwright/test';

// ❌ WRONG — these aliases do not exist
import { test } from '@fixtures';
import { softExpect } from '@assertions';
```

### Soft assertions

```typescript
// ✅ CORRECT — use expect.soft() from @_src/merge.fixture
expect.soft(json.title).toEqual(articleData.title);
await expect.soft(locator).toBeVisible();

// ❌ WRONG — softExpect does not exist in this project
softExpect(locator).toBeVisible();
```

### Path aliases

```typescript
// ✅ CORRECT
import { LoginPage } from '@_src/ui/pages/login.page';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { BASE_URL } from '@_config/env.config';

// ❌ WRONG — @pages, @src, @api do not exist
import { LoginPage } from '@pages/login.page';
```

### File locations

| What | Where |
|---|---|
| Merged fixture (test entry-point) | `src/merge.fixture.ts` |
| UI page objects | `src/ui/pages/` |
| UI fixtures | `src/ui/fixtures/page-object.fixture.ts` |
| API request classes | `src/api/requests/` |
| API fixtures | `src/api/fixtures/request-object.fixture.ts` |
| API models | `src/api/models/` |
| API factories | `src/api/factories/` |
| API data (DDT) | `src/api/data/` |
| UI test data (DDT) | `src/ui/test-data/` |
| Environment config | `config/env.config.ts` |
| `.env` file | project root `.env` |
