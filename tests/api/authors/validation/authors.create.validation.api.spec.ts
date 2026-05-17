import { invalidAuthorPayloads } from '@_src/api/data/invalid-author-payloads';
import { nonStandardInputs } from '@_src/api/data/non-standard-inputs';
import { prepareAuthorPayload } from '@_src/api/factories/author-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Authors create validation @api @author', () => {
  test.describe('Non-standard inputs for firstName', () => {
    nonStandardInputs.forEach((input) => {
      test(`should return 200 when creating author with non-standard firstName: ${input}`, async ({
        authorsRequest,
      }) => {
        // Arrange
        const expectedStatusCode = 200;
        const payload = prepareAuthorPayload();
        payload.firstName = input;

        // Act
        const response = await authorsRequest.post(payload);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Non-standard inputs for lastName', () => {
    nonStandardInputs.forEach((input) => {
      test(`should return 200 when creating author with non-standard lastName: ${input}`, async ({
        authorsRequest,
      }) => {
        // Arrange
        const expectedStatusCode = 200;
        const payload = prepareAuthorPayload();
        payload.lastName = input;

        // Act
        const response = await authorsRequest.post(payload);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid author payloads', () => {
    invalidAuthorPayloads.forEach((data) => {
      test(`should handle author with: ${data.case}`, async ({
        authorsRequest,
      }) => {
        // Arrange
        const payload = data.payload;

        // Act
        const response = await authorsRequest.post(payload);

        // Assert
        await expect.soft(response).toBeOK();
      });
    });
  });
});
