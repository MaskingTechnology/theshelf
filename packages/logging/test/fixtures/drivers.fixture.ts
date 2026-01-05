
import type { Driver } from '../../src/index.js';
import { MemoryDriver } from '../../src/index.js';

function empty()
{
    return new MemoryDriver();
}

function withMessages(): Driver
{
    const driver = new MemoryDriver();
    
    driver.logDebug('debug');
    driver.logInfo('info');
    driver.logWarn('warn');
    driver.logError('error');
    driver.logFatal('fatal');

    return driver;
}

export const DRIVERS = { empty, withMessages };
