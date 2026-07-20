
import { VALUES } from './values.fixture.js';

export type Fruit =
{
    readonly id: string;
    readonly name: string;
    readonly country: string;
    readonly sprayed: boolean;
};

export type Pizza =
{
    readonly id: string;
    readonly name: string;
    readonly size: number;
    readonly price: number;
    readonly folded: boolean;
};

export const RECORD_TYPES =
{
    FRUITS: 'fruits',
    PIZZAS: 'pizzas'
};

const FRUITS: Record<string, Fruit> =
{
    APPLE: { id: VALUES.IDS.APPLE, name: 'Apple', country: 'Belgium', sprayed: false },
    PEAR: { id: VALUES.IDS.PEAR, name: 'Pear', country: 'Netherlands', sprayed: true }
};

const PIZZAS: Record<string, Pizza> =
{
    MARGHERITA: { id: VALUES.IDS.MARGHERITA, name: 'Margherita', size: 15, price: 12.00, folded: false },
    CALZONE: { id: VALUES.IDS.CALZONE, name: 'Calzone', size: 20, price: 11.00, folded: true },
    PEPPERONI: { id: VALUES.IDS.PEPPERONI, name: 'Pepperoni', size: 18, price: 13.50, folded: false },
    VEGETARIAN: { id: VALUES.IDS.VEGETARIAN, name: 'Vegetarian', size: 30, price: 8.50, folded: true },
    HAWAII: { id: VALUES.IDS.HAWAII, name: 'Hawaii', size: 20, price: 10.00, folded: false }
};

export const RECORDS = { FRUITS, PIZZAS };
