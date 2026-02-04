
import ConnectionManager from '../../src/index.js';

import { ConnectableMock } from '../mocks/index.js';

import { logger } from './logger.fixture.js';

type ReturnType = [ConnectionManager, ConnectableMock];

async function forConnect(): Promise<ReturnType>
{
    const name = 'Connect Fixture';
    const connectable = new ConnectableMock(30, 0);
    const monitoringTimeout = 10000;

    const manager = new ConnectionManager({ name, connectable, monitoringTimeout }, logger);

    return [manager, connectable];
}

async function forDisconnect(): Promise<ReturnType>
{
    const name = 'Disconnect Fixture';
    const connectable = new ConnectableMock(0, 30);
    const monitoringTimeout = 10000;

    const manager = new ConnectionManager({ name, connectable, monitoringTimeout }, logger);
    await manager.connect();

    return [manager, connectable];
}

async function forMonitoring(): Promise<ReturnType>
{
    const name = 'Monitor Fixture';
    const connectable = new ConnectableMock(30, 0);
    const monitoringTimeout = 10;

    const manager = new ConnectionManager({ name, connectable, monitoringTimeout }, logger);

    return [manager, connectable];
}

export const MANAGERS = { forConnect, forDisconnect, forMonitoring };
