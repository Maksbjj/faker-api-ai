import { expect, test } from '@_src/merge.fixture';

test.describe('Authors DELETE operations @crud @delete @api @author', () => {
  test('should return 200 when deleting author by id @TAG-AU04-01', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await authorsRequest.delete(1);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
