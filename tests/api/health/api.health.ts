import { expect, test as health } from '@playwright/test';

health(
  'should return 200 for Activities health check @health @api',
  async ({ request }) => {
    // Arrange
    const expectedStatusCode = 200;

    // Act
    const response = await request.get('/api/v1/Activities');

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  },
);
