import { FullConfig } from '@playwright/test';
import { request } from 'playwright-core';

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('⚠️ Global setup');
  const baseURL = config.projects[0].use.baseURL;
  const requestContext = await request.newContext();

  try {
    await requestContext.get(baseURL!);
    // const response = await requestContext.get(baseURL!);
    // console.log('Response ok?', response.ok());
  } catch {
    throw new Error(
      `❌ Failed to connect to ${baseURL} 
      check if the application is running and the baseUrl is correct`,
    );
  }
}

export default globalSetup;
