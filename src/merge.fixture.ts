import { mergeTests } from '@playwright/test';

import { requestObjectTest } from '@_src/api/fixtures/request-object.fixture';

export const test = mergeTests(requestObjectTest);
export { expect } from '@playwright/test';

