
import type { Log } from './types.js';

export interface Driver
{
    log(log: Log): Promise<void>;
}
