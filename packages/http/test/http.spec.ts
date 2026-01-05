
import { beforeEach, describe, expect, it } from 'vitest';

import { HTTP_CLIENTS, RESPONSES, URLS, http } from './fixtures/index.js';

beforeEach(() =>
{
    HTTP_CLIENTS.withCache();
});

describe('integrations/http/Client', () =>
{
    describe('.get', () =>
    {
        it('should get a cached result', async () =>
        {
            const result = await http.get(URLS.CACHED);

            expect(result).toEqual(RESPONSES.CACHED);
        });

        it('should get a non-cached result from its implementation', async () =>
        {
            const result = await http.get(URLS.NOT_CACHED);

            expect(result).toEqual(RESPONSES.NOT_CACHED);
        });
    });

    describe('.post', () =>
    {
        it('should post a cached result', async () =>
        {
            const result = await http.post(URLS.CACHED, null);

            expect(result).toEqual(RESPONSES.CACHED);
        });

        it('should post a non-cached result from its implementation', async () =>
        {
            const result = await http.post(URLS.NOT_CACHED, null);

            expect(result).toEqual(RESPONSES.NOT_CACHED);
        });
    });

    describe('.put', () =>
    {
        it('should put a cached result', async () =>
        {
            const result = await http.put(URLS.CACHED, null);

            expect(result).toEqual(RESPONSES.CACHED);
        });

        it('should put a non-cached result from its implementation', async () =>
        {
            const result = await http.put(URLS.NOT_CACHED, null);

            expect(result).toEqual(RESPONSES.NOT_CACHED);
        });
    });

    describe('.patch', () =>
    {
        it('should patch a cached result', async () =>
        {
            const result = await http.patch(URLS.CACHED, null);

            expect(result).toEqual(RESPONSES.CACHED);
        });

        it('should patch a non-cached result from its implementation', async () =>
        {
            const result = await http.patch(URLS.NOT_CACHED, null);

            expect(result).toEqual(RESPONSES.NOT_CACHED);
        });
    });

    describe('.delete', () =>
    {
        it('should delete a cached result', async () =>
        {
            const result = await http.delete(URLS.CACHED);

            expect(result).toEqual(RESPONSES.CACHED);
        });

        it('should delete a non-cached result from its implementation', async () =>
        {
            const result = await http.delete(URLS.NOT_CACHED);

            expect(result).toEqual(RESPONSES.NOT_CACHED);
        });
    });

    describe('.head', () =>
    {
        it('should give a cached result', async () =>
        {
            const result = await http.get(URLS.CACHED);

            expect(result).toEqual(RESPONSES.CACHED);
        });

        it('should give a non-cached result from its implementation', async () =>
        {
            const result = await http.get(URLS.NOT_CACHED);

            expect(result).toEqual(RESPONSES.NOT_CACHED);
        });
    });
});
