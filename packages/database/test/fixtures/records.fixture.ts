
import type { RecordData } from '../../src/index.js';

import { VALUES } from './values.fixture.js';

export const RECORD_TYPES =
{
    FRUITS: 'fruits',
    PIZZAS: 'pizzas'
};

export const RECORDS: Record<string, Record<string, RecordData>> =
{
    FRUITS: {
        APPLE: { id: VALUES.IDS.APPLE, name: 'Apple', country: 'Belgium', sprayed: false },
        PEAR: { id: VALUES.IDS.PEAR, name: 'Pear', country: 'Netherlands', sprayed: true }
    },

    PIZZAS: {
        MARGHERITA: { id: VALUES.IDS.MARGHERITA, name: 'Margherita', size: 15, price: 12.00, folded: false },
        CALZONE: { id: VALUES.IDS.CALZONE, name: 'Calzone', size: 20, price: 11.00, folded: true },
        PEPPERONI: { id: VALUES.IDS.PEPPERONI, name: 'Pepperoni', size: 18, price: 13.50, folded: false },
        VEGETARIAN: { id: VALUES.IDS.VEGETARIAN, name: 'Vegetarian', size: 30, price: 8.50, folded: true },
        HAWAII: { id: VALUES.IDS.HAWAII, name: 'Hawaii', size: 20, price: 10.00, folded: false }
    }
};
