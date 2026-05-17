import { prepareAuthorPayload } from '@_src/api/factories/author-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Authors POST operations @crud @create @api @author', () => {
  test('should return 200 and matching payload when creating author @TAG-AU02-01', async ({
    authorsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = prepareAuthorPayload();

    // Act
    const response = await authorsRequest.post(payload);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.firstName).toEqual(payload.firstName);
    expect.soft(json.lastName).toEqual(payload.lastName);
    expect.soft(json.idBook).toEqual(payload.idBook);
  });
});
