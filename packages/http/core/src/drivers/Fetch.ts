
import { HttpMethods } from '../definitions/constants.js';
import type { Driver } from '../definitions/interfaces.js';

export default class Fetch implements Driver
{
    get name(): string { return Fetch.name; }

    get(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return fetch(url, { method: HttpMethods.GET, headers });
    }

    post(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return fetch(url, { method: HttpMethods.POST, headers, body: JSON.stringify(body) });
    }

    put(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return fetch(url, { method: HttpMethods.PUT, headers, body: JSON.stringify(body) });
    }

    patch(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return fetch(url, { method: HttpMethods.PATCH, headers, body: JSON.stringify(body) });
    }

    delete(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return fetch(url, { method: HttpMethods.DELETE, headers });
    }

    head(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return fetch(url, { method: HttpMethods.HEAD, headers });
    }
}
