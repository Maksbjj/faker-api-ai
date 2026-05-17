import { invalidBookPayloads } from '@_src/api/data/invalid-book-payloads';
import { nonStandardInputs } from '@_src/api/data/non-standard-inputs';
import { prepareBookPayload } from '@_src/api/factories/book-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Books create validation @api @book', () => {
  test.describe('Non-standard inputs for title', () => {
    nonStandardInputs.forEach((input) => {
      test(`should return 200 when creating book with non-standard title: ${input}`, async ({
        booksRequest,
      }) => {
        // Arrange
        const expectedStatusCode = 200;
        const payload = prepareBookPayload();
        payload.title = input;

        // Act
        const response = await booksRequest.post(payload);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid book payloads', () => {
    invalidBookPayloads.forEach((data) => {
      test(`should handle book with: ${data.case}`, async ({
        booksRequest,
      }) => {
        // Arrange
        const payload = data.payload;

        // Act
        const response = await booksRequest.post(payload);

        // Assert
        await expect.soft(response).toBeOK();
      });
    });
  });
});
