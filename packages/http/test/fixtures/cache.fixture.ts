
import { HttpMethods } from '../../src/index.js';

import { http } from './http.fixture.js';
import { RESPONSES } from './responses.fixture.js';
import { URLS } from './urls.fixture.js';

function reset(): void
{
    http.clearCache();

    http.setCache(HttpMethods.GET, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.POST, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.PUT, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.PATCH, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.DELETE, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.HEAD, URLS.CACHED, RESPONSES.CACHED);
}

export const CACHE = { reset };
