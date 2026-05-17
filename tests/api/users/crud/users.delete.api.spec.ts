import { expect, test } from '@_src/merge.fixture';

test.describe('Users DELETE operations @crud @delete @api @user', () => {
  test('should return 200 when deleting user by id @TAG-U04-01', async ({
    usersRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await usersRequest.delete(1);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
