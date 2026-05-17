import { prepareAuthorPayload } from '@_src/api/factories/author-payload.api.factory';
import { AuthorPayload } from '@_src/api/models/author.api.model';

interface InvalidAuthorPayload {
  case: string;
  payload: AuthorPayload;
}

const base = prepareAuthorPayload();

export const invalidAuthorPayloads: InvalidAuthorPayload[] = [
  { case: 'firstName empty', payload: { ...base, firstName: '' } },
  { case: 'lastName empty', payload: { ...base, lastName: '' } },
];
