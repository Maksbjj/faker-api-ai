export const apiUrls = {
  activitiesUrl: '/api/v1/Activities',
  authorsUrl: '/api/v1/Authors',
  booksUrl: '/api/v1/Books',
  coverPhotosUrl: '/api/v1/CoverPhotos',
  usersUrl: '/api/v1/Users',
};

export function timestamp(): string {
  return `${new Date().valueOf()}`;
}
