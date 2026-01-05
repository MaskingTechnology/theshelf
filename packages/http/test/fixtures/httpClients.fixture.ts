
import http from '../../src/index.js';
import { HttpMethods } from '../../src/definitions/constants.js';

import { mockDriver } from './driver.mock.js';
import { RESPONSES } from './responses.fixture.js';
import { URLS } from './urls.fixture.js';

http.driver = mockDriver;

export { http };

function withCache(): void
{
    http.clearCache();

    http.setCache(HttpMethods.GET, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.POST, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.PUT, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.PATCH, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.DELETE, URLS.CACHED, RESPONSES.CACHED);
    http.setCache(HttpMethods.HEAD, URLS.CACHED, RESPONSES.CACHED);
}

export const HTTP_CLIENTS = { withCache };
