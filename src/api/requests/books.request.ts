import { BookPayload } from '@_src/api/models/book.api.model';
import { BaseRequest } from '@_src/api/requests/base.request';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from 'playwright-core';

export class BooksRequest extends BaseRequest {
  constructor(request: APIRequestContext) {
    super(request, apiUrls.booksUrl);
  }

  async getOne(id: number): Promise<APIResponse> {
    return this.request.get(`${this.url}/${id}`);
  }

  async post(data: BookPayload): Promise<APIResponse> {
    return this.request.post(this.url, { data });
  }

  async put(data: BookPayload, id: number): Promise<APIResponse> {
    return this.request.put(`${this.url}/${id}`, { data });
  }

  async delete(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.url}/${id}`);
  }
}
