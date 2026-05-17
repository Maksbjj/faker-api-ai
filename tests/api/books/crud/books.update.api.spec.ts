import { prepareBookPayload } from '@_src/api/factories/book-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Books PUT operations @crud @modify @api @book', () => {
  test('should return 200 and updated book when updating book by id @TAG-B03-01', async ({
    booksRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = { ...prepareBookPayload(), id: 1 };

    // Act
    const response = await booksRequest.put(payload, 1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBe(1);
    expect.soft(json.title).toEqual(payload.title);
    expect.soft(json.pageCount).toEqual(payload.pageCount);
  });
});
