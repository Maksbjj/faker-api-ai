import { expect, test } from '@_src/merge.fixture';

test.describe('Activities GET operations @crud @get @api @activity', () => {
  test('should return 200 and array when getting all activities @TAG-A01-01', async ({
    activitiesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await activitiesRequest.get();
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(Array.isArray(json)).toBe(true);
    expect.soft(json.length).toBeGreaterThan(0);
  });

  test('should return 200 and activity matching schema when getting activity by id @TAG-A01-02', async ({
    activitiesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await activitiesRequest.getOne(1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBe(1);
    expect.soft(typeof json.title === 'string' || json.title === null).toBe(true);
    expect.soft(typeof json.completed).toBe('boolean');
  });

  test('should return 404 when getting activity with non-existent id @TAG-A01-03', async ({
    activitiesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 404;

    // Act
    const response = await activitiesRequest.getOne(99999);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
