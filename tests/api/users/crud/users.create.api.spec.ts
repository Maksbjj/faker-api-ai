import { prepareUserPayload } from '@_src/api/factories/user-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Users POST operations @crud @create @api @user', () => {
  test('should return 200 and matching payload when creating user @TAG-U02-01', async ({
    usersRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = prepareUserPayload();

    // Act
    const response = await usersRequest.post(payload);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.userName).toEqual(payload.userName);
    expect.soft(json.password).toEqual(payload.password);
  });
});
