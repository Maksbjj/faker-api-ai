import { APIRequestContext, APIResponse } from 'playwright-core';

export class BaseRequest {
  constructor(
    protected request: APIRequestContext,
    protected url: string,
  ) {}

  async get(): Promise<APIResponse> {
    return this.request.get(this.url);
  }
}
