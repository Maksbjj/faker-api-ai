import { prepareUserPayload } from '@_src/api/factories/user-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Users PUT operations @crud @modify @api @user', () => {
  test('should return 200 and updated user when updating user by id @TAG-U03-01', async ({
    usersRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = { ...prepareUserPayload(), id: 1 };

    // Act
    const response = await usersRequest.put(payload, 1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBe(1);
    expect.soft(json.userName).toEqual(payload.userName);
    expect.soft(json.password).toEqual(payload.password);
  });
});
