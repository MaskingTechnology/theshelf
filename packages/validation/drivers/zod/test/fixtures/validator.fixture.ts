
import Validator from '@theshelf/validation';

import { ZodDriver } from '../../src/index.js';

const driver = new ZodDriver();
const validator = new Validator(driver);

export { validator };
