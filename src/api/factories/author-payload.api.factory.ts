import { faker } from '@faker-js/faker';

import { AuthorPayload } from '@_src/api/models/author.api.model';

export function prepareAuthorPayload(): AuthorPayload {
  return {
    id: 0,
    idBook: faker.number.int({ min: 1, max: 200 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}
