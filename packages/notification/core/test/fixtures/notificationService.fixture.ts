
import NotificationService, { MemoryDriver } from '../../src/index.js';

import { VALUES } from './values.fixture.js';

const driver = new MemoryDriver();
const notificationService = new NotificationService(driver);

async function withRecipient(): Promise<void>
{
    driver.clear();
    
    await notificationService.subscribe(VALUES.RECIPIENTS.FIRST, undefined);
}

export { notificationService };

export const SEEDS = { withRecipient };
