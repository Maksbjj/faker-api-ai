import { invalidUserPayloads } from '@_src/api/data/invalid-user-payloads';
import { nonStandardInputs } from '@_src/api/data/non-standard-inputs';
import { prepareUserPayload } from '@_src/api/factories/user-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Users create validation @api @user', () => {
  test.describe('Non-standard inputs for userName', () => {
    nonStandardInputs.forEach((input) => {
      test(`should return 200 when creating user with non-standard userName: ${input}`, async ({
        usersRequest,
      }) => {
        // Arrange
        const expectedStatusCode = 200;
        const payload = prepareUserPayload();
        payload.userName = input;

        // Act
        const response = await usersRequest.post(payload);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid user payloads', () => {
    invalidUserPayloads.forEach((data) => {
      test(`should handle user with: ${data.case}`, async ({
        usersRequest,
      }) => {
        // Arrange
        const payload = data.payload;

        // Act
        const response = await usersRequest.post(payload);

        // Assert
        await expect.soft(response).toBeOK();
      });
    });
  });
});
