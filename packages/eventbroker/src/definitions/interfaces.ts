
import type { Publication, Subscription } from './types.js';

export interface Driver
{
    get connected(): boolean;

    connect(): Promise<void>;
    disconnect(): Promise<void>;

    publish<T>(publication: Publication<T>): Promise<void>;
    subscribe<T>(subscription: Subscription<T>): Promise<void>;
    unsubscribe<T>(subscription: Subscription<T>): Promise<void>;
}
