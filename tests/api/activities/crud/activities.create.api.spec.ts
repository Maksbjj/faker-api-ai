import { prepareActivityPayload } from '@_src/api/factories/activity-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Activities POST operations @crud @create @api @activity', () => {
  test('should return 200 and matching payload when creating activity @TAG-A02-01', async ({
    activitiesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const payload = prepareActivityPayload();

    // Act
    const response = await activitiesRequest.post(payload);
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
    expect.soft(json.title).toEqual(payload.title);
    expect.soft(json.completed).toEqual(payload.completed);
  });
});
