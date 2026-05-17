import { prepareCoverPhotoPayload } from '@_src/api/factories/cover-photo-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('CoverPhotos POST operations @crud @create @api @coverphoto', () => {
  test('should return 200 and matching payload when creating cover photo @TAG-CP02-01', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = prepareCoverPhotoPayload();

    // Act
    const response = await coverPhotosRequest.post(payload);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.idBook).toEqual(payload.idBook);
    expect.soft(json.url).toEqual(payload.url);
  });
});
