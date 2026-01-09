
export const HttpMethods =
{
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD'
} as const;

export type HttpMethod = typeof HttpMethods[keyof typeof HttpMethods];
