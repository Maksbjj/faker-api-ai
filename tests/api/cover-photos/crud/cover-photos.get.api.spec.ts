import { expect, test } from '@_src/merge.fixture';

test.describe('CoverPhotos GET operations @crud @get @api @coverphoto', () => {
  test('should return 200 and array when getting all cover photos @TAG-CP01-01', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await coverPhotosRequest.get();
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(Array.isArray(json)).toBe(true);
    expect.soft(json.length).toBeGreaterThan(0);
  });

  test('should return 200 and cover photo matching schema when getting cover photo by id @TAG-CP01-02', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await coverPhotosRequest.getOne(1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBeDefined();
    expect.soft(json.idBook).toBeDefined();
    expect.soft(json.url).toBeDefined();
  });

  test('should return 404 when getting cover photo with non-existent id @TAG-CP01-03', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 404;

    // Act
    const response = await coverPhotosRequest.getOne(99999);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should return 200 and array of covers for given book id @TAG-CP01-04', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await coverPhotosRequest.getByBook(1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(Array.isArray(json)).toBe(true);
  });

  test(
    'should return 200 and empty array for book id with no covers @TAG-CP01-05',
    {
      annotation: {
        type: 'issue',
        description: 'behaviour not verified for non-existent book id',
      },
    },
    async ({ coverPhotosRequest }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(true);

      // Arrange
      const expectedStatusCode = 200;

      // Act
      const response = await coverPhotosRequest.getByBook(99999);
      const json = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
      expect.soft(Array.isArray(json)).toBe(true);
    },
  );
});
