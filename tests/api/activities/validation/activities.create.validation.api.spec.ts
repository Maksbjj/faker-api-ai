import { invalidActivityPayloads } from '@_src/api/data/invalid-activity-payloads';
import { nonStandardInputs } from '@_src/api/data/non-standard-inputs';
import { prepareActivityPayload } from '@_src/api/factories/activity-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Activities create validation @api @activity', () => {
  test.describe('Non-standard inputs for title', () => {
    nonStandardInputs.forEach((input) => {
      test(`should return 200 when creating activity with non-standard title: ${input}`, async ({
        activitiesRequest,
      }) => {
        // Arrange
        const expectedStatusCode = 200;
        const payload = prepareActivityPayload();
        payload.title = input;

        // Act
        const response = await activitiesRequest.post(payload);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid activity payloads', () => {
    invalidActivityPayloads.forEach((data) => {
      test(`should handle activity with: ${data.case}`, async ({
        activitiesRequest,
      }) => {
        // Arrange
        const payload = data.payload;

        // Act
        const response = await activitiesRequest.post(payload);

        // Assert
        await expect.soft(response).toBeOK();
      });
    });
  });
});
