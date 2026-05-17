---
applyTo: '**'
---

# Test Structure and Conventions

---

## Merged Fixture Entry-Point

Create a single `src/merge.fixture.ts` that merges all fixture extensions:

```typescript
import { requestObjectTest } from '@_src/api/fixtures/request-object.fixture';
import { pageObjectTest }    from '@_src/ui/fixtures/page-object.fixture';
// import additional fixture extensions here as your project grows
import { mergeTests }        from '@playwright/test';

export const test = mergeTests(pageObjectTest, requestObjectTest);
export { expect } from '@playwright/test';
```

**All test files import `test` and `expect` from this file.** There are no separate `@fixtures` or `@assertions` aliases — use the path alias configured in `tsconfig.json` (e.g. `@_src/merge.fixture`).

---

## CRITICAL: Never Use Manual Page Management

```typescript
// ❌ NEVER
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page    = await context.newPage();
});

test.afterEach(async () => {
  await page?.close();
});
```

Use the fixture system — page objects are injected automatically per test.

---

## AAA Pattern (Arrange / Act / Assert)

Every test body is organized with inline section comments:

```typescript
test('Should create an article @TAG-R04-01 @logged', async ({ addArticleView }) => {
  // Arrange
  const expectedTitle = 'My New Article';
  const articleData = { title: expectedTitle, body: 'Some body text' };

  // Act
  const articlePage = await addArticleView.createArticle(articleData);

  // Assert
  await expect.soft(articlePage.articleTitle).toHaveText(expectedTitle);
});
```

---

## Test Title Conventions

**UI tests** — start with `Should` (capital S):
```typescript
test('Should display error for empty username @TAG-R02-01', async ({ loginPage }) => { ... });
test('Should create article with valid data @TAG-R02-01 @logged', async ({ ... }) => { ... });
```

**API tests** — start with `should` (lowercase):
```typescript
test('should create article with auth @TAG-R09-01', async ({ articlesRequestLogged }) => { ... });
test('should return 401 without auth @TAG-R09-01', async ({ articlesRequest }) => { ... });
```

---

## test.step() for UI Tests

Group logical actions into steps. Step descriptions start with a capital letter:

```typescript
test('Should complete article lifecycle @logged', async ({ articlesPage, addArticleView }) => {
  await test.step('Create article', async () => {
    // ...
  });

  await test.step('Verify article appears in list', async () => {
    // ...
  });

  await test.step('Delete article and verify removal', async () => {
    // ...
  });
});
```

API tests do **not** need `test.step()` — the AAA comments are sufficient.

---

## Soft vs Hard Assertions

```typescript
// Hard expect — stops the test immediately if it fails
expect(response.status()).toBe(201);
expect(title).toContain('Welcome');

// Soft expect — test continues, all failures reported together
await expect.soft(articlePage.articleTitle).toHaveText(articleData.title); // locator → await
expect.soft(json.title).toEqual(articleData.title);                        // plain value → no await
```

Use `expect.soft()` for non-critical field checks. Use hard `expect()` for status codes, navigation, and critical assertions.

---

## Extract Expected Values

Assign expected values to named constants before assertions:

```typescript
// ✅ CORRECT
const expectedStatusCode = 201;
expect(response.status()).toBe(expectedStatusCode);

// ❌ WRONG
expect(response.status()).toBe(201);
```

---

## Tags

Tags are part of the test title string, space-separated:

```typescript
test('Should create article @TAG-R04-01 @crud @logged', async ({ ... }) => { ... });
```

- `@TAG-R*-*` — requirement reference, on individual `test()` calls
- `@logged` — test requires an authenticated session
- `@crud`, `@create`, `@delete`, `@modify` — operation category
- `@predefined_data` — test depends on pre-seeded data

---

## Serial E2E Tests

For lifecycle tests where order matters, use `test.describe.configure`:

```typescript
test.describe.configure({ mode: 'serial' });
test.describe('Article lifecycle @logged', () => {
  let articleData: AddArticleModel;

  test('create article', async ({ createRandomArticle }) => {
    articleData = createRandomArticle.articleData;
    // ...
  });

  test('verify article exists', async ({ articlesPage }) => {
    // uses articleData set by the previous test
  });

  test('delete article', async ({ articlesPage }) => {
    // ...
  });
});
```

Only use `serial` mode for genuine lifecycle flows. All other tests must be fully independent.

---

## Page Object Fixtures Pattern

Fixture extensions use `baseTest.extend<T>()`. Page objects are instantiated inside the fixture, navigated if needed, then injected into tests:

```typescript
// src/ui/fixtures/page-object.fixture.ts
import { test as baseTest } from '@playwright/test';

interface Pages {
  loginPage:    LoginPage;
  articlesPage: ArticlesPage;
  // ...
}

export const pageObjectTest = baseTest.extend<Pages>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  articlesPage: async ({ page }, use) => {
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await use(articlesPage);
  },
});
```

For fixtures that depend on another fixture (e.g. `addArticleView` depends on `articlesPage`), destructure the dependency:

```typescript
addArticleView: async ({ articlesPage }, use) => {
  const view = await articlesPage.clickAddArticleButtonLogged();
  await use(view);
},
```

---

## Test File Location

| Test type | Directory | Playwright project |
|---|---|---|
| Health check | `tests/api/health/` | `health` |
| API CRUD | `tests/api/<resource>-crud/` | `api` |
| API smoke | `tests/api/smokes/` | `api` |
| API validation | `tests/api/<resource>-validation/` | `api` |
| UI E2E serial | `tests/ui/end-to-end/` | `chromium-logged` or `chromium-non-logged` |
| UI integration | `tests/ui/integration/` | same |
| UI smoke | `tests/ui/smoke/` | same |
| Auth setup | `tests/ui/setup/` | `setup` |


**Every test file (UI and API) must import `test` and `expect` from the merged fixture:**

```typescript
// ✅ CORRECT — single import for all tests
import { expect, test } from '@_src/merge.fixture';

// ❌ WRONG — do not import from @playwright/test in test files
import { test } from '@playwright/test';

// ❌ WRONG — these aliases do not exist in this project
import { test } from '@fixtures';
import { softExpect } from '@assertions';
```

`src/merge.fixture.ts` is the entry-point that exposes all page object fixtures, article fixtures, and request object fixtures together via `mergeTests`.

---

## CRITICAL: NEVER Use Manual Page Management

```typescript
// ❌ NEVER DO THIS
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext(); // FORBIDDEN
  page = await context.newPage(); // FORBIDDEN
});

test.afterEach(async () => {
  await page?.close(); // FORBIDDEN
});
```

Use the fixtures from the merged fixture entry-point — they create and inject page objects automatically.

---

## Test Structure Guidelines

### 1. Imports

```typescript
import { expect, test } from '@_src/merge.fixture';
import { SomeModel }     from '@_src/ui/models/some.model';
import { someFactory }   from '@_src/ui/factories/some.factory';
```

All source imports use the `@_src/*` alias. Never use relative paths in test files.

---

### 2. AAA Pattern (Arrange / Act / Assert)

Every test body must be organized with inline `// Arrange`, `// Act`, `// Assert` comments:

```typescript
test('Should complete login flow @TAG-R01-01', async ({ loginPage }) => {
  // Arrange
  const expectedTitle = 'Welcome';
  const credentials = { userEmail: testUser1.userEmail, userPassword: testUser1.userPassword };

  // Act
  const welcomePage = await loginPage.login(credentials);
  const title = await welcomePage.getTitle();

  // Assert
  expect(title).toContain(expectedTitle);
});
```

---

### 3. UI Test Titles: Start with 'Should' (capital S)

```typescript
// ✅ CORRECT
test('Should display error on invalid login', async ({ loginPage }) => { ... });
test('Should create article with valid data @TAG-R04-01 @logged', async ({ ... }) => { ... });

// ❌ WRONG
test('should display error', async () => { ... });
test('display error on invalid login', async () => { ... });
```

---

### 4. API Test Titles: Start with 'should' (lowercase)

```typescript
// ✅ CORRECT (API convention)
test('should create an article with logged-in user @TAG-R09-01', async ({ articlesRequestLogged }) => { ... });
test('should not create an article without a logged-in user @TAG-R09-01', async ({ articlesRequest }) => { ... });
```

---

### 5. Use test.step() for Grouping (UI Tests)

Step descriptions start with a capital letter:

```typescript
test('Should create and delete article @TAG-R04-01 @logged', async ({ addArticleView, articlesPage }) => {
  await test.step('Create article', async () => {
    // ...
  });

  await test.step('Verify article exists', async () => {
    // ...
  });

  await test.step('Delete article and verify removal', async () => {
    // ...
  });
});
```

---

### 6. Soft vs Hard Assertions

Use `expect.soft()` for non-blocking field-level checks. Use `expect()` (hard) for critical checkpoints like navigation and status codes.

```typescript
// Hard expect — test stops if this fails
expect(response.status()).toBe(201);
expect(title).toContain('Welcome');

// Soft expect — test continues even if this fails
expect.soft(articlePage.articleTitle).toHaveText(articleData.title);  // locator — await it
await expect.soft(articlePage.articleBody).toHaveText(articleData.body, { useInnerText: true });
expect.soft(json.title).toEqual(articleData.title);                    // plain value — no await
```

---

### 7. Extract Expected Values

Always assign expected values to named constants before using them in assertions:

```typescript
// ✅ CORRECT
const expectedStatusCode = 201;
expect(response.status()).toBe(expectedStatusCode);

// ❌ WRONG
expect(response.status()).toBe(201);
```

---

### 8. Tags Convention

Tags are part of the test title string:

```typescript
test('Should create article @TAG-R04-01 @crud @logged', async ({ ... }) => { ... });
```

- `@TAG-R*-*` — requirement reference (on individual `test()`)
- `@logged` — routes test to `chromium-logged` Playwright project (authenticated session)
- `@crud`, `@create`, `@delete`, `@modify` — operation category
- `@predefined_data` — test depends on pre-seeded data

---

### 9. Serial E2E Tests

For lifecycle tests where order matters, use `test.describe.configure`:

```typescript
test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete article', () => {
  let articleData: AddArticleModel;

  test('create new article @TAG-R04-01 @logged', async ({ createRandomArticle }) => {
    articleData = createRandomArticle.articleData;
    // ...
  });

  test('user can delete his own article @TAG-R04-04 @logged', async ({ articlesPage }) => {
    // uses articleData from previous test
  });
});
```

Only use `test.describe.configure({ mode: 'serial' })` for genuine lifecycle flows. All other tests must be independent.

---

### 10. Available Fixtures

All fixtures are defined by your project's fixture extensions. The names are determined by the keys in each `baseTest.extend<T>()` call.

To see what is available in your project: find the merged fixture entry-point (search for `mergeTests`) and read the individual extension files it imports (search for `baseTest.extend`).

**Pattern:** each UI fixture extension adds one fixture per page/view; each API fixture extension adds one unauthenticated and one authenticated variant per resource.

---

## Test Execution

```bash
npm test                   # all projects
npx playwright test --ui   # UI mode
npx playwright test --headed
npx playwright test --grep "@logged"
npx playwright test tests/api/articles-crud/articles.create.api.spec.ts
```
