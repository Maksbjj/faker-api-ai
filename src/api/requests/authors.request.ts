import { AuthorPayload } from '@_src/api/models/author.api.model';
import { BaseRequest } from '@_src/api/requests/base.request';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from 'playwright-core';

export class AuthorsRequest extends BaseRequest {
  constructor(request: APIRequestContext) {
    super(request, apiUrls.authorsUrl);
  }

  async getOne(id: number): Promise<APIResponse> {
    return this.request.get(`${this.url}/${id}`);
  }

  async post(data: AuthorPayload): Promise<APIResponse> {
    return this.request.post(this.url, { data });
  }

  async put(data: AuthorPayload, id: number): Promise<APIResponse> {
    return this.request.put(`${this.url}/${id}`, { data });
  }

  async delete(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.url}/${id}`);
  }

  async getByBook(idBook: number): Promise<APIResponse> {
    return this.request.get(`${this.url}/authors/books/${idBook}`);
  }
}
