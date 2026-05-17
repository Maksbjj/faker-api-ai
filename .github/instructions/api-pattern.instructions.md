---
applyTo: '**'
---

# API Layer Pattern — Request Object Model

The API layer uses a **Request Object Model** — analogous to the Page Object Model on the UI side. Each API resource gets its own class that encapsulates all HTTP operations for that resource.

---

## 1. Layer Structure

```
src/api/
  assertions/     # Shared status-code / response assertion helpers
  data/           # Static data arrays and generator functions for DDT
  factories/      # Payload builders using faker — one file per resource
  fixtures/       # Playwright fixture extensions (requestObjectTest)
  models/         # TypeScript interfaces for payloads and responses
  requests/       # BaseRequest + one derived class per resource
  utils/          # API URL constants, timestamp() and other helpers
```

---

## 2. BaseRequest

All request classes extend a single `BaseRequest`. It stores the request context, the endpoint URL, and optional auth headers:

```typescript
// src/api/requests/base.request.ts
import { Headers } from '@_src/api/models/headers.api.model';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseRequest {
  constructor(
    protected request: APIRequestContext,
    protected url: string,
    protected headers?: Headers,
  ) {}

  async get(): Promise<APIResponse> {
    return this.request.get(this.url, { headers: this.headers });
  }
}
```

---

## 3. Resource Request Classes

One class per resource, extending `BaseRequest`. Methods map 1:1 to HTTP verbs. Every method passes `this.headers` through:

```typescript
// src/api/requests/articles.request.ts
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { Headers }        from '@_src/api/models/headers.api.model';
import { BaseRequest }    from '@_src/api/requests/base.request';
import { apiUrls }        from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest extends BaseRequest {
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    super(request, apiUrls.articlesUrl, headers);
  }

  async getOne(id: string): Promise<APIResponse> {
    return this.request.get(`${this.url}/${id}`, { headers: this.headers });
  }

  async post(data: ArticlePayload): Promise<APIResponse> {
    return this.request.post(this.url, { headers: this.headers, data });
  }

  async put(data: ArticlePayload, id: string): Promise<APIResponse> {
    return this.request.put(`${this.url}/${id}`, { headers: this.headers, data });
  }

  async patch(data: Partial<ArticlePayload>, id: string): Promise<APIResponse> {
    return this.request.patch(`${this.url}/${id}`, { headers: this.headers, data });
  }

  async delete(id: string): Promise<APIResponse> {
    return this.request.delete(`${this.url}/${id}`, { headers: this.headers });
  }
}
```

**Rules:**
- Return type is always `Promise<APIResponse>` — never parse the response inside the class.
- Constructor signature: `(request, headers?)` — headers are optional for unauthenticated use.
- Constructor calls `super(request, apiUrls.<resource>Url, headers)`.
- No explicit `public` / `private` modifiers.

---

## 4. API URL Constants

All endpoint paths live in one exported constant object:

```typescript
// src/api/utils/api.util.ts
export const apiUrls = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
  loginUrl:    '/api/login',
  healthUrl:   'api/health',
  usersUrl:    'api/users',
};

export function timestamp(): string {
  return `${new Date().valueOf()}`;
}
```

When adding a new resource, add its URL here first — no magic strings elsewhere.

---

## 5. Models

Payload and response shapes are TypeScript `interface`s, never classes. Named with a `Payload` or `Model` suffix:

```typescript
// src/api/models/article.api.model.ts
export interface ArticlePayload {
  title: string;
  body:  string;
  date:  string;
  image: string;
}
```

Naming: `PascalCase`. File suffix: `.api.model.ts`.

---

## 6. Factories

Factories produce realistic random payload objects using `@faker-js/faker`. They share random data with UI factories when models overlap:

```typescript
// src/api/factories/article-payload.api.factory.ts
import { ArticlePayload } from '@_src/api/models/article.api.model';

export function prepareArticlePayload(): ArticlePayload {
  return {
    title: faker.lorem.sentence(),
    body:  faker.lorem.paragraphs(2),
    date:  new Date().toISOString(),
    image: '',
  };
}
```

**Rules:**
- Function name: `verbNoun` convention — `prepareArticlePayload`, `prepareUserPayload`.
- Always return a typed interface — never `any`.
- File suffix: `.api.factory.ts`.

---

## 7. Authorization Header Factory

Authenticated API requests require a `Bearer` token. Create a dedicated factory that calls the login endpoint and extracts the token:

```typescript
// src/api/factories/authorization-header.api.factory.ts
import { USER_EMAIL, USER_PASSWORD } from '@_config/env.config';
import { LoginPayload }              from '@_src/api/models/login.api.model';
import { Headers }                   from '@_src/api/models/headers.api.model';
import { apiUrls }                   from '@_src/api/utils/api.util';
import { APIRequestContext }         from '@playwright/test';

export async function getAuthorizationHeader(request: APIRequestContext): Promise<Headers> {
  const loginPayload: LoginPayload = {
    email:    USER_EMAIL,
    password: USER_PASSWORD,
  };
  const response = await request.post(apiUrls.loginUrl, { data: loginPayload });
  const body = await response.json();
  return { Authorization: `Bearer ${body.access_token}` };
}
```

---

## 8. API Fixture Extension

Extend Playwright's `baseTest` with typed request objects. Provide both unauthenticated and authenticated variants for each resource:

```typescript
// src/api/fixtures/request-object.fixture.ts
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlesRequest }        from '@_src/api/requests/articles.request';
import { test as baseTest }       from '@playwright/test';

interface Requests {
  articlesRequest:       ArticlesRequest;
  articlesRequestLogged: ArticlesRequest;
  // add more resources here
}

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    await use(new ArticlesRequest(request));
  },
  articlesRequestLogged: async ({ request }, use) => {
    const headers = await getAuthorizationHeader(request);
    await use(new ArticlesRequest(request, headers));
  },
});
```

Merge this fixture in `src/merge.fixture.ts` alongside UI fixtures.

---

## 9. Shared API Assertion Helpers

Extract repeated assertion patterns into helpers so tests stay concise:

```typescript
// src/api/assertions/assertions.api.ts
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { expect }          from '@_src/merge.fixture';

export async function expectGetOneResponseStatus(
  requestObject: ArticlesRequest,
  id: string,
  expectedStatusCode: number,
): Promise<void> {
  const response = await requestObject.getOne(id);
  expect(
    response.status(),
    `expected ${expectedStatusCode}, received ${response.status()}`,
  ).toBe(expectedStatusCode);
}
```

---

## 10. API Test File Pattern

```typescript
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { expect, test }          from '@_src/merge.fixture';

test.describe('Verify articles CRUD @crud @api @article', () => {

  test('should not create article without auth @TAG-R09-01', async ({
    articlesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articleData = prepareArticlePayload();

    // Act
    const response = await articlesRequest.post(articleData);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should create article with auth @TAG-R09-01', async ({
    articlesRequestLogged,
  }) => {
    // Arrange
    const expectedStatusCode = 201;
    const articleData = prepareArticlePayload();

    // Act
    const response = await articlesRequestLogged.post(articleData);

    // Assert
    const actualStatus = response.status();
    expect(actualStatus, `expected ${expectedStatusCode}, got ${actualStatus}`).toBe(expectedStatusCode);

    const json = await response.json();
    expect.soft(json.title).toEqual(articleData.title);
    expect.soft(json.body).toEqual(articleData.body);
  });

});
```

**Rules:**
- Import `test` and `expect` from `src/merge.fixture.ts` (the project's merged fixture).
- Follow **AAA** (Arrange / Act / Assert) with inline comments.
- API test titles start with lowercase `should`.
- Extract expected values to named constants before assertions.
- Use `expect.soft()` for response body field assertions; hard `expect()` for status codes.
- Tag `test.describe` blocks with operation category and resource tags.
- Requirement/ticket tags go on individual `test()` calls.
