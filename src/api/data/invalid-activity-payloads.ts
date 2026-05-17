import { prepareActivityPayload } from '@_src/api/factories/activity-payload.api.factory';
import { ActivityPayload } from '@_src/api/models/activity.api.model';

interface InvalidActivityPayload {
  case: string;
  payload: ActivityPayload;
}

const base = prepareActivityPayload();

export const invalidActivityPayloads: InvalidActivityPayload[] = [
  { case: 'title empty', payload: { ...base, title: '' } },
];
