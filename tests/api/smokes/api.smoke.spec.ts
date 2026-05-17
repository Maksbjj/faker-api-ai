import { expect, test } from '@_src/merge.fixture';

test.describe('API smoke tests @smoke @api', () => {
  test('should return 200 for GET all activities @smoke @api', async ({
    activitiesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await activitiesRequest.get();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should return 200 for GET all authors @smoke @api', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await authorsRequest.get();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should return 200 for GET all books @smoke @api', async ({
    booksRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await booksRequest.get();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should return 200 for GET all cover photos @smoke @api', async ({
    coverPhotosRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await coverPhotosRequest.get();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should return 200 for GET all users @smoke @api', async ({
    usersRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await usersRequest.get();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
