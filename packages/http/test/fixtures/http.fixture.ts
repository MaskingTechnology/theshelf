
import Http from '../../src/index.js';

import { MockDriver } from '../mocks/index.js';

import { RESPONSES } from './responses.fixture.js';

const mockDriver = new MockDriver(RESPONSES.NOT_CACHED);

const http = new Http(mockDriver);

export { http };
