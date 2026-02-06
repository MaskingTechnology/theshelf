
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { LogLevels } from '../src/index.js';

import { logger, driver, VALUES, RESULTS } from './fixtures/index.js';

beforeEach(() =>
{
    driver.clear();
});

describe('Logger', () =>
{
    describe('levels', () =>
    {
        it('should respect DEBUG level', async () =>
        {
            logger.logLevel = LogLevels.DEBUG;

            await logger.debug('debug');
            await logger.info('info');
            await logger.warn('warn');
            await logger.error('error');
            await logger.fatal('fatal');

            const logs = driver.logs;

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

            await logger.debug('debug');
            await logger.info('info');
            await logger.warn('warn');
            await logger.error('error');
            await logger.fatal('fatal');

            const logs = driver.logs;

            expect(logs).toHaveLength(4);
            expect(logs[0].level).toEqual(LogLevels.INFO);
            expect(logs[1].level).toEqual(LogLevels.WARN);
            expect(logs[2].level).toEqual(LogLevels.ERROR);
            expect(logs[3].level).toEqual(LogLevels.FATAL);
        });

        it('should respect WARN level', async () =>
        {
            logger.logLevel = LogLevels.WARN;

            await logger.debug('debug');
            await logger.info('info');
            await logger.warn('warn');
            await logger.error('error');
            await logger.fatal('fatal');

            const logs = driver.logs;

            expect(logs).toHaveLength(3);
            expect(logs[0].level).toEqual(LogLevels.WARN);
            expect(logs[1].level).toEqual(LogLevels.ERROR);
            expect(logs[2].level).toEqual(LogLevels.FATAL);
        });

        it('should respect ERROR level', async () =>
        {
            logger.logLevel = LogLevels.ERROR;

            await logger.debug('debug');
            await logger.info('info');
            await logger.warn('warn');
            await logger.error('error');
            await logger.fatal('fatal');

            const logs = driver.logs;

            expect(logs).toHaveLength(2);
            expect(logs[0].level).toEqual(LogLevels.ERROR);
            expect(logs[1].level).toEqual(LogLevels.FATAL);
        });

        it('should respect FATAL level', async () =>
        {
            logger.logLevel = LogLevels.FATAL;

            await logger.debug('debug');
            await logger.info('info');
            await logger.warn('warn');
            await logger.error('error');
            await logger.fatal('fatal');

            const logs = driver.logs;

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

        it('should convert primitive values', async () =>
        {
            await logger.info(VALUES.TEXT);
            await logger.info(VALUES.BOOLEAN);
            await logger.info(VALUES.NUMBER);

            const logs = driver.logs;

            expect(logs).toHaveLength(3);
            expect(logs[0].message).toEqual(RESULTS.TEXT);
            expect(logs[1].message).toEqual(RESULTS.BOOLEAN);
            expect(logs[2].message).toEqual(RESULTS.NUMBER);
        });

        it('should convert no values', async () =>
        {
            await logger.info(VALUES.UNDEFINED);
            await logger.info(VALUES.NULL);

            const logs = driver.logs;

            expect(logs).toHaveLength(2);
            expect(logs[0].message).toEqual(RESULTS.UNDEFINED);
            expect(logs[1].message).toEqual(RESULTS.NULL);
        });

        it('should convert a function value', async () =>
        {
            await logger.info(VALUES.FUNCTION);

            const logs = driver.logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual(RESULTS.FUNCTION);
        });

        it('should convert an array value', async () =>
        {
            await logger.info(VALUES.ARRAY);

            const logs = driver.logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual(RESULTS.ARRAY);
        });

        it('should convert an object value', async () =>
        {
            await logger.info(VALUES.OBJECT);

            const logs = driver.logs;
            
            expect(logs).toHaveLength(1);
            expect(logs[0].message).toEqual(RESULTS.OBJECT);
        });

        it('should convert an error value', async () =>
        {
            await logger.info(VALUES.ERROR_STACK);
            await logger.info(VALUES.ERROR_MESSAGE);

            const logs = driver.logs;
            
            expect(logs).toHaveLength(2);
            expect(logs[0].message).toEqual(RESULTS.ERROR_STACK);
            expect(logs[1].message).toEqual(RESULTS.ERROR_MESSAGE);
        });
    });
});
