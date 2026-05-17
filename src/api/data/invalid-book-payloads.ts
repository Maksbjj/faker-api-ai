import { prepareBookPayload } from '@_src/api/factories/book-payload.api.factory';
import { BookPayload } from '@_src/api/models/book.api.model';

interface InvalidBookPayload {
  case: string;
  payload: BookPayload;
}

const base = prepareBookPayload();

export const invalidBookPayloads: InvalidBookPayload[] = [
  { case: 'title empty', payload: { ...base, title: '' } },
  { case: 'description empty', payload: { ...base, description: '' } },
  { case: 'excerpt empty', payload: { ...base, excerpt: '' } },
];
