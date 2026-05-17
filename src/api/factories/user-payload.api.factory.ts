import { faker } from '@faker-js/faker';

import { UserPayload } from '@_src/api/models/user.api.model';

export function prepareUserPayload(): UserPayload {
  return {
    id: 0,
    userName: faker.internet.username(),
    password: faker.internet.password(),
  };
}
