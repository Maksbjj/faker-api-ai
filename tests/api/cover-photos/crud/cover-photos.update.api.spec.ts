import { prepareCoverPhotoPayload } from '@_src/api/factories/cover-photo-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('CoverPhotos PUT operations @crud @modify @api @coverphoto', () => {
  test('should return 200 and updated cover photo when updating cover photo by id @TAG-CP03-01', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = { ...prepareCoverPhotoPayload(), id: 1 };

    // Act
    const response = await coverPhotosRequest.put(payload, 1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBe(1);
    expect.soft(json.idBook).toEqual(payload.idBook);
    expect.soft(json.url).toEqual(payload.url);
  });
});
