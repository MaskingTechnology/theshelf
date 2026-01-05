
export const HttpMethods =
{
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD'
} as const;

type Keys = keyof typeof HttpMethods;
export type HttpMethod = typeof HttpMethods[Keys];
