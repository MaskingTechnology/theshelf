
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { MemoryDriver } from '../src/index.js';
import logger, { LogLevels } from '../src/index.js';

import { DRIVERS, VALUES, RESULTS } from './fixtures/index.js';

beforeEach(() =>
{
    logger.driver = DRIVERS.empty();
});

describe('logger', () =>
{
    describe('levels', () =>
    {
        it('should respect DEBUG level', async () =>
        {
            logger.logLevel = LogLevels.DEBUG;

            logger.logDebug('debug');
            logger.logInfo('info');
            logger.logWarn('warn');
            logger.logError('error');
            logger.logFatal('fatal');

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(5);
            expect(logs[0].level).toEqual(LogLevels.DEBUG);
            expect(logs[1].level).toEqual(LogLevels.INFO);
            expect(logs[2].level).toEqual(LogLevels.WARN);
            expect(logs[3].level).toEqual(LogLevels.ERROR);
            expect(logs[4].level).toEqual(LogLevels.FATAL);
        });

        it('should respect INFO level', async () =>
        {
            logger.logLevel = LogLevels.INFO;

            logger.logDebug('debug');
            logger.logInfo('info');
            logger.logWarn('warn');
            logger.logError('error');
            logger.logFatal('fatal');

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(4);
            expect(logs[0].level).toEqual(LogLevels.INFO);
            expect(logs[1].level).toEqual(LogLevels.WARN);
            expect(logs[2].level).toEqual(LogLevels.ERROR);
            expect(logs[3].level).toEqual(LogLevels.FATAL);
        });

        it('should respect WARN level', async () =>
        {
            logger.logLevel = LogLevels.WARN;

            logger.logDebug('debug');
            logger.logInfo('info');
            logger.logWarn('warn');
            logger.logError('error');
            logger.logFatal('fatal');

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(3);
            expect(logs[0].level).toEqual(LogLevels.WARN);
            expect(logs[1].level).toEqual(LogLevels.ERROR);
            expect(logs[2].level).toEqual(LogLevels.FATAL);
        });

        it('should respect ERROR level', async () =>
        {
            logger.logLevel = LogLevels.ERROR;

            logger.logDebug('debug');
            logger.logInfo('info');
            logger.logWarn('warn');
            logger.logError('error');
            logger.logFatal('fatal');

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(2);
            expect(logs[0].level).toEqual(LogLevels.ERROR);
            expect(logs[1].level).toEqual(LogLevels.FATAL);
        });

        it('should respect FATAL level', async () =>
        {
            logger.logLevel = LogLevels.FATAL;

            logger.logDebug('debug');
            logger.logInfo('info');
            logger.logWarn('warn');
            logger.logError('error');
            logger.logFatal('fatal');

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(1);
            expect(logs[0].level).toEqual(LogLevels.FATAL);
        });
    });

    describe('messages', () =>
    {
        beforeAll(() =>
        {
            logger.logLevel = LogLevels.DEBUG;
        });

        it('should convert primative values', async () =>
        {
            logger.logInfo(VALUES.TEXT);
            logger.logInfo(VALUES.BOOLEAN);
            logger.logInfo(VALUES.NUMBER);

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(3);
            expect(logs[0].message).toEqual(RESULTS.TEXT);
            expect(logs[1].message).toEqual(RESULTS.BOOLEAN);
            expect(logs[2].message).toEqual(RESULTS.NUMBER);
        });

        it('should convert no values', async () =>
        {
            logger.logInfo(VALUES.UNDEFINED);
            logger.logInfo(VALUES.NULL);

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(2);
            expect(logs[0].message).toEqual(RESULTS.UNDEFINED);
            expect(logs[1].message).toEqual(RESULTS.NULL);
        });

        it('should convert a function value', async () =>
        {
            logger.logInfo(VALUES.FUNCTION);

            const logs = (logger.driver as MemoryDriver).logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual(RESULTS.FUNCTION);
        });

        it('should convert an array value', async () =>
        {
            logger.logInfo(VALUES.ARRAY);

            const logs = (logger.driver as MemoryDriver).logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual(RESULTS.ARRAY);
        });

        it('should convert an object value', async () =>
        {
            logger.logInfo(VALUES.OBJECT);

            const logs = (logger.driver as MemoryDriver).logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual(RESULTS.OBJECT);
        });

        it('should convert an error value', async () =>
        {
            logger.logInfo(VALUES.ERROR_STACK);
            logger.logInfo(VALUES.ERROR_MESSAGE);

            const logs = (logger.driver as MemoryDriver).logs;
            
            expect(logs).toHaveLength(2);
            expect(logs[0].message).toEqual(RESULTS.ERROR_STACK);
            expect(logs[1].message).toEqual(RESULTS.ERROR_MESSAGE);
        });
    });
});
