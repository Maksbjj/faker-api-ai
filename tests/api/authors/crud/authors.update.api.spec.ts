import { prepareAuthorPayload } from '@_src/api/factories/author-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Authors PUT operations @crud @modify @api @author', () => {
  test('should return 200 and updated author when updating author by id @TAG-AU03-01', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = { ...prepareAuthorPayload(), id: 1 };

    // Act
    const response = await authorsRequest.put(payload, 1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBe(1);
    expect.soft(json.firstName).toEqual(payload.firstName);
    expect.soft(json.lastName).toEqual(payload.lastName);
  });
});
