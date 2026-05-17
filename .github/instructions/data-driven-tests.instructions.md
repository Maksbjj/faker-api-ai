---
applyTo: '**'
---

# Data-Driven Tests (DDT)

Use data-driven testing when the same test logic needs to run over multiple input permutations. The pattern uses `.forEach()` inside `test.describe` blocks, with a typed array of test case objects.

---

## 1. Core Pattern: `.forEach()` Loop

```typescript
dataArray.forEach((data) => {
  test(
    `test title — ${data.case}`,
    { annotation: data.info?.annotation },
    async ({ fixture }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(!!data.info?.skip);

      // Arrange / Act / Assert using data fields
    },
  );
});
```

**Rules:**
- Interpolate `data.case` into the test title so each generated test has a unique, descriptive name.
- Pass `{ annotation: data.info?.annotation }` as the second argument to `test()` to attach metadata.
- `test.skip(!!data.info?.skip)` is the **first statement inside the test body**.
- The `// eslint-disable-next-line playwright/no-skipped-test` comment is required on the line above `test.skip`.

---

## 2. Static Data Array

Use a plain exported array when the cases are small and fixed:

```typescript
// src/api/data/non-standard-inputs.ts
export const nonStandardInputs = [
  'undefined', 'undef', 'null', 'NULL', '(null)',
  'nil', 'NIL', 'true', 'false', 'True', 'False', 'TRUE', 'FALSE',
];
```

Usage in test:

```typescript
nonStandardInputs.forEach((input) => {
  test(`should accept non-standard input: ${input}`, async ({ usersRequest }) => {
    const payload = prepareUserPayload();
    payload.firstname = input;
    const response = await usersRequest.post(payload);
    await expect.soft(response).toBeOK();
  });
});
```

---

## 3. Generator Function (Dynamic Data)

Use a generator function when the test cases mirror the fields of a payload — so the suite stays in sync automatically if the interface changes:

```typescript
// src/api/data/invalid-user-payloads.ts
interface InvalidUserPayload {
  case:    string;
  payload: UserRegisterPayload;
  info?: {
    skip:       boolean;
    annotation: { type: string; description: string };
  };
}

export function invalidUserPayloadsGenerator(): InvalidUserPayload[] {
  const skipKeys = ['password']; // known broken fields — skip with annotation

  return Object.keys(prepareUserPayload()).map((key) => {
    const entry: InvalidUserPayload = {
      case:    `${key} empty`,
      payload: { ...prepareUserPayload(), [key]: '' },
    };
    if (skipKeys.includes(key)) {
      entry.info = {
        skip: true,
        annotation: {
          type:        'issue',
          description: `field ${key} does not reject empty value — issue #1234`,
        },
      };
    }
    return entry;
  });
}
```

**Rules for generators:**
- Name the function `<resource>Generator()` or `invalid<Resource>PayloadsGenerator()`.
- Call `prepareXPayload()` inside the generator — do not hardcode field names.
- `skipKeys` lists fields with known failures; the annotation records the issue reference.
- Return a typed `interface[]` — never `any[]`.

---

## 4. UI DDT Pattern

The same shape, but with a UI model and an extra `field` property that names the DOM element to assert against:

```typescript
// src/ui/test-data/invalid-user.data.ts
interface InvalidUserUi {
  case:    string;
  payload: RegisterUserModel;
  field:   string; // e.g. 'firstname', 'email' — matches the DOM error element
  info?: { skip: boolean; annotation: { type: string; description: string } };
}

export function invalidUserGeneratorUi(): InvalidUserUi[] {
  // same Object.keys() pattern as API generator
}
```

---

## 5. Full Test File Layout (API DDT)

```typescript
import { invalidUserPayloadsGenerator } from '@_src/api/data/invalid-user-payloads';
import { nonStandardInputs }            from '@_src/api/data/non-standard-inputs';
import { prepareUserPayload }           from '@_src/api/factories/user-register.factory';
import { expect, test }                 from '@_src/merge.fixture';

test.describe('User Registration Validation', () => {

  test('should create user with valid data', async ({ usersRequest }) => {
    // Arrange
    const expectedStatusCode = 201;
    const payload = prepareUserPayload();

    // Act
    const response = await usersRequest.post(payload);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test.describe('Non-standard inputs', () => {
    nonStandardInputs.forEach((input) => {
      test(`should accept non-standard firstname: ${input}`, async ({ usersRequest }) => {
        const payload = prepareUserPayload();
        payload.firstname = input;
        const response = await usersRequest.post(payload);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid user payloads', () => {
    invalidUserPayloadsGenerator().forEach((data) => {
      test(
        `should reject user with: ${data.case}`,
        { annotation: data.info?.annotation },
        async ({ usersRequest }) => {
          // eslint-disable-next-line playwright/no-skipped-test
          test.skip(!!data.info?.skip);

          // Arrange / Act
          const response = await usersRequest.post(data.payload);

          // Assert
          await expect.soft(response).not.toBeOK();
          expect(response.status()).toBe(422);
        },
      );
    });
  });

});
```

---

## 6. Skip + Annotation for Known Issues

When a test case is expected to fail due to a known bug, attach an annotation and skip it:

```typescript
{
  case:    'password empty',
  payload: { ...prepareUserPayload(), password: '' },
  info: {
    skip: true,
    annotation: {
      type:        'issue',
      description: 'empty password not rejected — issue #1234',
    },
  },
}
```

This keeps the case visible in reports (as skipped with a reason) without blocking the suite.

---

## 7. Where Data Files Live

| Layer | Directory | Naming convention |
|---|---|---|
| API | `src/api/data/` | `invalid-<resource>-payloads.ts`, `non-standard-inputs.ts` |
| UI | `src/ui/test-data/` | `invalid-<resource>.data.ts`, `<resource>.data.ts` |

Static pre-registered user credentials belong in `src/ui/test-data/<resource>.data.ts`. Invalid/boundary input data belongs in the `data/` or `test-data/` directories, not inline in test files.


---

## 1. Core Pattern: `.forEach()` Loop

```typescript
dataArray.forEach((data) => {
  test(
    `test title - ${data.case}`,
    { annotation: data.info?.annotation },
    async ({ fixture }) => {
      test.skip(!!data.info?.skip);

      // Arrange / Act / Assert using data.payload, data.field, etc.
    },
  );
});
```

**Rules:**
- The test title interpolates `data.case` so each generated test has a unique, descriptive name.
- The `{ annotation }` object is passed as the second argument to `test()` to attach requirement/issue metadata.
- `test.skip(!!data.info?.skip)` is always the **first statement inside the test body** — it skips known broken cases without removing them.
- The data array (or generator function) lives in `src/api/data/` or `src/ui/test-data/`.

---

## 2. Static Data Array

Use a plain exported array when the cases are small and fixed:

```typescript
// src/api/data/nonStandardInputs.ts
export const nonStandardInputs = [
  'undefined', 'undef', 'null', 'NULL', '(null)',
  'nil', 'NIL', 'true', 'false', 'True', 'False', 'TRUE', 'FALSE',
];
```

Usage in test:

```typescript
import { nonStandardInputs } from '@_src/api/data/nonStandardInputs';

nonStandardInputs.forEach((input) => {
  test(`verify user can be created with non-standard input: ${input}`, async ({ usersRequest }) => {
    const payload = prepareUserPayload();
    payload.firstname = input;
    const response = await usersRequest.post(payload);
    await expect.soft(response).toBeOK();
  });
});
```

---

## 3. Generator Function (Dynamic Data)

Use a **generator function** when the data set mirrors the fields of a payload and needs to stay in sync automatically:

```typescript
// src/api/data/invalidUserPayloads.ts
interface InvalidUserPayload {
  case: string;
  payload: UserRegisterPayload;
  info?: {
    skip: boolean;
    annotation: { type: string; description: string };
  };
}

export function invalidUserPayloadsGenerator(): InvalidUserPayload[] {
  const skipKeys = ['password']; // known broken fields

  return Object.keys(prepareUserPayload()).map((key) => {
    const entry: InvalidUserPayload = {
      case: `${key} empty`,
      payload: { ...prepareUserPayload(), [key]: '' },
    };
    if (skipKeys.includes(key)) {
      entry.info = {
        skip: true,
        annotation: {
          type: 'issue',
          description: `field ${key} not handle empty rejection issue 1234`,
        },
      };
    }
    return entry;
  });
}
```

**Rules for generators:**
- Name the function `<resource>Generator()` or `invalid<Resource>PayloadsGenerator()`.
- Use `prepareXPayload()` (not hardcoded values) so the generator stays in sync when the payload interface changes.
- Put knowingly broken fields in a `skipKeys` array and attach an `info` block with an issue reference.
- Always return a typed `interface[]` — never `any[]`.

---

## 4. UI Data-Driven Pattern

UI DDT follows the same shape but uses `RegisterUserModel` instead of API payloads:

```typescript
// src/ui/test-data/invalidUser.data.ts
interface InvalidUserUi {
  case: string;
  payload: RegisterUserModel;
  field: string;       // the DOM field name (e.g. 'firstname', 'email')
  info?: { skip: boolean; annotation: { type: string; description: string } };
}

export function invalidUserGeneratorUi(): InvalidUserUi[] { ... }
```

The extra `field` property identifies which UI error element to assert against.

---

## 5. Test File Layout (API DDT)

```typescript
import { invalidUserPayloadsGenerator } from '@_src/api/data/invalidUserPayloads';
import { nonStandardInputs }            from '@_src/api/data/nonStandardInputs';
import { prepareUserPayload }           from '@_src/api/factories/user-register.factory';
import { expect, test }                 from '@_src/merge.fixture';

test.describe('User Registration Validation', () => {

  test('verify if user can be created via API', async ({ usersRequest }) => {
    // Arrange
    const expectedStatusCode = 201;
    const payload = prepareUserPayload();

    // Act
    const response = await usersRequest.post(payload);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test.describe('Non-standard inputs', () => {
    nonStandardInputs.forEach((input) => {
      test(`verify user creation with non-standard input: ${input}`, async ({ usersRequest }) => {
        const payload = prepareUserPayload();
        payload.firstname = input;
        const response = await usersRequest.post(payload);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid user payloads', () => {
    invalidUserPayloadsGenerator().forEach((data) => {
      test(
        `verify user cannot be created via API with: ${data.case}`,
        { annotation: data.info?.annotation },
        async ({ usersRequest }) => {
          // eslint-disable-next-line playwright/no-skipped-test
          test.skip(!!data.info?.skip);

          // Arrange / Act
          const response = await usersRequest.post(data.payload);

          // Assert
          await expect.soft(response).not.toBeOK();
          expect(response.status()).toBe(422);
        },
      );
    });
  });
});
```

---

## 6. Annotations for Known Issues

When a test case is expected to fail due to a known bug, attach an annotation and skip it:

```typescript
{
  case: 'password empty',
  payload: { ...prepareUserPayload(), password: '' },
  info: {
    skip: true,
    annotation: {
      type: 'issue',
      description: 'field password not handle empty rejection issue 1234',
    },
  },
}
```

This keeps the test case visible in reports without blocking the suite.

---

## 7. Where Data Files Live

| Layer | Directory | Naming |
|---|---|---|
| API | `src/api/data/` | `invalidUserPayloads.ts`, `nonStandardInputs.ts` |
| UI | `src/ui/test-data/` | `invalidUser.data.ts`, `user.data.ts` |

- `user.data.ts` — static pre-registered user credentials (e.g. `testUser1`).
- `invalidUser.data.ts` — invalid registration payloads for UI DDT.
- `nonStandardInputs.ts` — edge-case string values for API boundary testing.
