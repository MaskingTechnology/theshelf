
import { beforeEach, describe, expect, it } from 'vitest';

import { States } from '../src/index.js';

import { logDriver, MANAGERS } from './fixtures/index.js';

beforeEach(() =>
{
    logDriver.clear();
});

describe('ConnectionManager', () =>
{
    describe('connection', () =>
    {
        it('should connect on request', async () =>
        {
            const [manager] = await MANAGERS.forConnect();

            // Should start with DISCONNECTED state

            expect(manager.state).toEqual(States.DISCONNECTED);

            // Should set the CONNECTING state on connect

            const promise1 = manager.connect();

            expect(manager.state).toEqual(States.CONNECTING);

            expect(logDriver.logs).toHaveLength(0);

            // Should detect parallel connect requests

            const promise2 = manager.connect();

            expect(manager.state).toEqual(States.CONNECTING);

            expect(logDriver.logs).toHaveLength(1);
            expect(logDriver.logs[0].message).toEqual('[CONNECTION][Connect Fixture] connect already in progress');

            // Should have CONNECTED state after awaiting

            await Promise.all([promise1, promise2]);

            expect(manager.state).toEqual(States.CONNECTED);

            expect(logDriver.logs).toHaveLength(3);
            expect(logDriver.logs[1].message).toEqual('[CONNECTION][Connect Fixture] connected successfully');
            expect(logDriver.logs[2].message).toEqual('[CONNECTION][Connect Fixture] monitoring started');

            // Should abort when already connected

            await manager.connect();

            expect(logDriver.logs).toHaveLength(4);
            expect(logDriver.logs[3].message).toEqual('[CONNECTION][Connect Fixture] connect in invalid state');
        });

        it('should disconnect on request', async () =>
        {
            const [manager] = await MANAGERS.forDisconnect();

            // Should start with CONNECTED state

            expect(manager.state).toEqual(States.CONNECTED);

            // Should set the DISCONNECTING state on disconnect

            const promise1 = manager.disconnect();

            expect(manager.state).toEqual(States.DISCONNECTING);

            expect(logDriver.logs).toHaveLength(3);
            expect(logDriver.logs[0].message).toEqual('[CONNECTION][Disconnect Fixture] connected successfully');
            expect(logDriver.logs[1].message).toEqual('[CONNECTION][Disconnect Fixture] monitoring started');
            expect(logDriver.logs[2].message).toEqual('[CONNECTION][Disconnect Fixture] monitoring stopped');

            // Should detect parallel disconnect requests

            const promise2 = manager.disconnect();

            expect(manager.state).toEqual(States.DISCONNECTING);

            expect(logDriver.logs).toHaveLength(4);
            expect(logDriver.logs[3].message).toEqual('[CONNECTION][Disconnect Fixture] disconnect already in progress');

            // Should have DISCONNECTED state after awaiting

            await Promise.all([promise1, promise2]);

            expect(manager.state).toEqual(States.DISCONNECTED);

            expect(logDriver.logs).toHaveLength(5);
            expect(logDriver.logs[4].message).toEqual('[CONNECTION][Disconnect Fixture] disconnected successfully');

            // Should abort when already disconnected

            await manager.disconnect();

            expect(logDriver.logs).toHaveLength(6);
            expect(logDriver.logs[5].message).toEqual('[CONNECTION][Disconnect Fixture] disconnect in invalid state');
        });
    });

    describe('monitoring', () =>
    {
        it('should periodically check the connection and try to restore when lost', async () =>
        {
            const [manager, connectable] = await MANAGERS.forMonitoring();

            await manager.connect();

            // Should start monitoring when connecting

            expect(manager.state).toEqual(States.CONNECTED);

            expect(logDriver.logs).toHaveLength(2);
            expect(logDriver.logs[0].message).toEqual('[CONNECTION][Monitor Fixture] connected successfully');
            expect(logDriver.logs[1].message).toEqual('[CONNECTION][Monitor Fixture] monitoring started');

            // Should monitor the connection

            await connectable.sleep(25);

            expect(logDriver.logs).toHaveLength(4);
            expect(logDriver.logs[2].message).toEqual('[CONNECTION][Monitor Fixture] monitoring connection');
            expect(logDriver.logs[3].message).toEqual('[CONNECTION][Monitor Fixture] monitoring connection');

            // Should detect connection loss

            connectable.fail();

            await connectable.sleep(42);

            expect(manager.state).toEqual(States.DISCONNECTED);

            expect(logDriver.logs).toHaveLength(7);
            expect(logDriver.logs[4].message).toEqual('[CONNECTION][Monitor Fixture] monitoring connection');
            expect(logDriver.logs[5].message).toEqual('[CONNECTION][Monitor Fixture] connection lost');
            expect(logDriver.logs[6].message).toContain('[CONNECTION][Monitor Fixture] connection failure');

            // Should detect connection restores

            connectable.restore();

            await connectable.sleep(42);

            expect(manager.state).toEqual(States.CONNECTED);

            expect(logDriver.logs).toHaveLength(10);
            expect(logDriver.logs[7].message).toEqual('[CONNECTION][Monitor Fixture] monitoring connection');
            expect(logDriver.logs[8].message).toEqual('[CONNECTION][Monitor Fixture] connection lost');
            expect(logDriver.logs[9].message).toEqual('[CONNECTION][Monitor Fixture] connected successfully');

            // Should stop monitoring when disconnecting

            await manager.disconnect();

            expect(logDriver.logs).toHaveLength(12);
            expect(logDriver.logs[10].message).toEqual('[CONNECTION][Monitor Fixture] monitoring stopped');
            expect(logDriver.logs[11].message).toEqual('[CONNECTION][Monitor Fixture] disconnected successfully');
        });
    });
});
