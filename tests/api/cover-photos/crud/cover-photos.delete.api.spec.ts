import { expect, test } from '@_src/merge.fixture';

test.describe('CoverPhotos DELETE operations @crud @delete @api @coverphoto', () => {
  test('should return 200 when deleting cover photo by id @TAG-CP04-01', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await coverPhotosRequest.delete(1);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
