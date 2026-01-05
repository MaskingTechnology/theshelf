
import notificationService from '../../src/index.js';

import { VALUES } from './values.fixture.js';

notificationService.connect();

async function withRecipient(): Promise<void>
{
    await notificationService.subscribe(VALUES.RECIPIENTS.FIRST, undefined);
}

export const NOTIFICATION_SERVICES = { withRecipient };
