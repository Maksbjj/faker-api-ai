import { expect, test } from '@_src/merge.fixture';

test.describe('Users GET operations @crud @get @api @user', () => {
  test('should return 200 and array when getting all users @TAG-U01-01', async ({
    usersRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await usersRequest.get();
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(Array.isArray(json)).toBe(true);
    expect.soft(json.length).toBeGreaterThan(0);
  });

  test('should return 200 and user matching schema when getting user by id @TAG-U01-02', async ({
    usersRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await usersRequest.getOne(1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBeDefined();
    expect.soft(json.userName).toBeDefined();
    expect.soft(json.password).toBeDefined();
  });

  test('should return 404 when getting user with non-existent id @TAG-U01-03', async ({
    usersRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 404;

    // Act
    const response = await usersRequest.getOne(99999);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
