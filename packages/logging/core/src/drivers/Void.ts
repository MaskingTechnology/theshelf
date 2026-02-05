
/* eslint @typescript-eslint/no-unused-vars: "off" */

import type { Driver } from '../definitions/interfaces.js';
import type { Log } from '../definitions/types.js';

export default class Void implements Driver
{
    async log(log: Log): Promise<void>
    {
        return;
    }
}
