import { expect, test } from '@_src/merge.fixture';

test.describe('Authors GET operations @crud @get @api @author', () => {
  test('should return 200 and array when getting all authors @TAG-AU01-01', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await authorsRequest.get();
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(Array.isArray(json)).toBe(true);
    expect.soft(json.length).toBeGreaterThan(0);
  });

  test('should return 200 and author matching schema when getting author by id @TAG-AU01-02', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await authorsRequest.getOne(1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBeDefined();
    expect.soft(json.idBook).toBeDefined();
    expect.soft(json.firstName).toBeDefined();
    expect.soft(json.lastName).toBeDefined();
  });

  test('should return 404 when getting author with non-existent id @TAG-AU01-03', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 404;

    // Act
    const response = await authorsRequest.getOne(99999);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should return 200 and array of authors for given book id @TAG-AU01-04', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await authorsRequest.getByBook(1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(Array.isArray(json)).toBe(true);
  });

  test(
    'should return 200 and empty array for book id with no authors @TAG-AU01-05',
    {
      annotation: {
        type: 'issue',
        description: 'behaviour not verified for non-existent book id',
      },
    },
    async ({ authorsRequest }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(true);

      // Arrange
      const expectedStatusCode = 200;

      // Act
      const response = await authorsRequest.getByBook(99999);
      const json = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
      expect.soft(Array.isArray(json)).toBe(true);
    },
  );
});
