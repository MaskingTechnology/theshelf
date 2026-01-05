
import type { Driver } from '../../src/definitions/interfaces.js';

import { RESPONSES } from './responses.fixture.js';

class MockDriver implements Driver
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async get(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return RESPONSES.NOT_CACHED;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async post(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return RESPONSES.NOT_CACHED;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async put(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return RESPONSES.NOT_CACHED;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async patch(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return RESPONSES.NOT_CACHED;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async delete(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return RESPONSES.NOT_CACHED;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async head(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return RESPONSES.NOT_CACHED;
    }
}

export const mockDriver = new MockDriver();
