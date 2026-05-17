import { prepareUserPayload } from '@_src/api/factories/user-payload.api.factory';
import { UserPayload } from '@_src/api/models/user.api.model';

interface InvalidUserPayload {
  case: string;
  payload: UserPayload;
}

const base = prepareUserPayload();

export const invalidUserPayloads: InvalidUserPayload[] = [
  { case: 'userName empty', payload: { ...base, userName: '' } },
  { case: 'password empty', payload: { ...base, password: '' } },
];
