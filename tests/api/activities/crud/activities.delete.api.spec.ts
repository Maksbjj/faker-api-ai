import { expect, test } from '@_src/merge.fixture';

test.describe('Activities DELETE operations @crud @delete @api @activity', () => {
  test('should return 200 when deleting activity by id @TAG-A04-01', async ({
    activitiesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await activitiesRequest.delete(1);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
