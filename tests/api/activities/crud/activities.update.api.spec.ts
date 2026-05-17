import { prepareActivityPayload } from '@_src/api/factories/activity-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Activities PUT operations @crud @modify @api @activity', () => {
  test('should return 200 and updated activity when updating activity by id @TAG-A03-01', async ({
    activitiesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = { ...prepareActivityPayload(), id: 1, completed: true };

    // Act
    const response = await activitiesRequest.put(payload, 1);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.id).toBe(1);
    expect.soft(json.title).toEqual(payload.title);
    expect.soft(json.completed).toBe(true);
  });
});
