import { test as baseTest } from '@playwright/test';

import { ActivitiesRequest } from '@_src/api/requests/activities.request';
import { AuthorsRequest } from '@_src/api/requests/authors.request';
import { BooksRequest } from '@_src/api/requests/books.request';
import { CoverPhotosRequest } from '@_src/api/requests/cover-photos.request';
import { UsersRequest } from '@_src/api/requests/users.request';

interface Requests {
  activitiesRequest: ActivitiesRequest;
  authorsRequest: AuthorsRequest;
  booksRequest: BooksRequest;
  coverPhotosRequest: CoverPhotosRequest;
  usersRequest: UsersRequest;
}

export const requestObjectTest = baseTest.extend<Requests>({
  activitiesRequest: async ({ request }, use) => {
    await use(new ActivitiesRequest(request));
  },
  authorsRequest: async ({ request }, use) => {
    await use(new AuthorsRequest(request));
  },
  booksRequest: async ({ request }, use) => {
    await use(new BooksRequest(request));
  },
  coverPhotosRequest: async ({ request }, use) => {
    await use(new CoverPhotosRequest(request));
  },
  usersRequest: async ({ request }, use) => {
    await use(new UsersRequest(request));
  },
});
