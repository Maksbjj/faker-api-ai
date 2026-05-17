import { expect, test } from '@_src/merge.fixture';

test.describe('Books DELETE operations @crud @delete @api @book', () => {
  test('should return 200 when deleting book by id @TAG-B04-01', async ({
    booksRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await booksRequest.delete(1);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
