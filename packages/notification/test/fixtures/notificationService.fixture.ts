
import NotificationService, { MemoryDriver } from '../../src/index.js';

import { VALUES } from './values.fixture.js';

const driver = new MemoryDriver();
const notificationService = new NotificationService(driver);

async function withRecipient(): Promise<void>
{
    //driver.clear();
    
    await driver.subscribe(VALUES.RECIPIENTS.FIRST);
}

export { notificationService };

export const NOTIFICATIONS = { withRecipient };
