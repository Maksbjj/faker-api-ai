import { faker } from '@faker-js/faker';

import { CoverPhotoPayload } from '@_src/api/models/cover-photo.api.model';

export function prepareCoverPhotoPayload(): CoverPhotoPayload {
  return {
    id: 0,
    idBook: faker.number.int({ min: 1, max: 200 }),
    url: faker.image.url(),
  };
}
