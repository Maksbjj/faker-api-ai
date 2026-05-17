import { prepareCoverPhotoPayload } from '@_src/api/factories/cover-photo-payload.api.factory';
import { CoverPhotoPayload } from '@_src/api/models/cover-photo.api.model';

interface InvalidCoverPhotoPayload {
  case: string;
  payload: CoverPhotoPayload;
}

const base = prepareCoverPhotoPayload();

export const invalidCoverPhotoPayloads: InvalidCoverPhotoPayload[] = [
  { case: 'url empty', payload: { ...base, url: '' } },
];
