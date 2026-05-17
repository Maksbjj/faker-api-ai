import { prepareBookPayload } from '@_src/api/factories/book-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Books POST operations @crud @create @api @book', () => {
  test('should return 200 and matching payload when creating book @TAG-B02-01', async ({
    booksRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = prepareBookPayload();

    // Act
    const response = await booksRequest.post(payload);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.title).toEqual(payload.title);
    expect.soft(json.pageCount).toEqual(payload.pageCount);
    expect.soft(json.description).toEqual(payload.description);
  });
});
