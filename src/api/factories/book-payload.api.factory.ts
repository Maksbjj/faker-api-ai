import { faker } from '@faker-js/faker';

import { BookPayload } from '@_src/api/models/book.api.model';

export function prepareBookPayload(): BookPayload {
  return {
    id: 0,
    title: faker.lorem.words(4),
    description: faker.lorem.paragraph(),
    pageCount: faker.number.int({ min: 1, max: 1000 }),
    excerpt: faker.lorem.sentences(2),
    publishDate: new Date().toISOString(),
  };
}
