import { faker } from '@faker-js/faker';

import { ActivityPayload } from '@_src/api/models/activity.api.model';

export function prepareActivityPayload(): ActivityPayload {
  return {
    id: 0,
    title: faker.lorem.words(3),
    dueDate: new Date().toISOString(),
    completed: faker.datatype.boolean(),
  };
}
