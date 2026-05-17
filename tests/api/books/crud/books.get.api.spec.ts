import { expect, test } from '@_src/merge.fixture';

test.describe('Books GET operations @crud @get @api @book', () => {
  test('should return 200 and array when getting all books @TAG-B01-01', async ({
    booksRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await booksRequest.get();
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(Array.isArray(json)).toBe(true);
    expect.soft(json.length).toBeGreaterThan(0);
  });

  test('should return 200 and book matching schema when getting book by id @TAG-B01-02', async ({
    booksRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await booksRequest.getOne(1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBeDefined();
    expect.soft(json.title).toBeDefined();
    expect.soft(json.pageCount).toBeDefined();
    expect.soft(json.publishDate).toBeDefined();
  });

  test('should return 404 when getting book with non-existent id @TAG-B01-03', async ({
    booksRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 404;

    // Act
    const response = await booksRequest.getOne(99999);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
