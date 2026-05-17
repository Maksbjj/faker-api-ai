import { invalidCoverPhotoPayloads } from '@_src/api/data/invalid-cover-photo-payloads';
import { nonStandardInputs } from '@_src/api/data/non-standard-inputs';
import { prepareCoverPhotoPayload } from '@_src/api/factories/cover-photo-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('CoverPhotos create validation @api @coverphoto', () => {
  test.describe('Non-standard inputs for url', () => {
    nonStandardInputs.forEach((input) => {
      test(`should return 200 when creating cover photo with non-standard url: ${input}`, async ({
        coverPhotosRequest,
      }) => {
        // Arrange
        const expectedStatusCode = 200;
        const payload = prepareCoverPhotoPayload();
        payload.url = input;

        // Act
        const response = await coverPhotosRequest.post(payload);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid cover photo payloads', () => {
    invalidCoverPhotoPayloads.forEach((data) => {
      test(`should handle cover photo with: ${data.case}`, async ({
        coverPhotosRequest,
      }) => {
        // Arrange
        const payload = data.payload;

        // Act
        const response = await coverPhotosRequest.post(payload);

        // Assert
        await expect.soft(response).toBeOK();
      });
    });
  });
});
