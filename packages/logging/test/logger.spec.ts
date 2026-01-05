
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { MemoryDriver } from '../src/index.js';
import logger, { LogLevels } from '../src/index.js';

import { DRIVERS } from './fixtures/index.js';

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
            logger.logInfo('text');
            logger.logInfo(true);
            logger.logInfo(3.14);

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(3);
            expect(logs[0].message).toEqual('text');
            expect(logs[1].message).toEqual('true');
            expect(logs[2].message).toEqual('3.14');
        });

        it('should convert no values', async () =>
        {
            logger.logInfo(undefined);
            logger.logInfo(null);

            const logs = (logger.driver as MemoryDriver).logs;

            expect(logs).toHaveLength(2);
            expect(logs[0].message).toEqual('undefined');
            expect(logs[1].message).toEqual('null');
        });

        it('should convert a function value', async () =>
        {
            function dummy() {}

            logger.logInfo(dummy);

            const logs = (logger.driver as MemoryDriver).logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual('function');
        });

        it('should convert an array value', async () =>
        {
            const array = ['text', true, 3.14];

            logger.logInfo(array);

            const logs = (logger.driver as MemoryDriver).logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual('text true 3.14');
        });

        it('should convert an object value', async () =>
        {
            const object = { a: 'text', b: true, c: 3.14 };

            logger.logInfo(object);

            const logs = (logger.driver as MemoryDriver).logs;
            const expected = JSON.stringify(object);
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual(expected);
        });

        it('should convert an error value', async () =>
        {
            const stackError = new Error('Stack');

            const messageError = new Error('Message');
            messageError.stack = undefined;

            logger.logInfo(stackError);
            logger.logInfo(messageError);

            const logs = (logger.driver as MemoryDriver).logs;
            
            expect(logs).toHaveLength(2);
            expect(logs[0].message).toEqual(stackError.stack);
            expect(logs[1].message).toEqual(messageError.message);
        });
    });
});
