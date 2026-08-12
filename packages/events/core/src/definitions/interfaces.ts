
import type { Publication, Subscription, ErrorHandler } from './types.js';

export interface Driver
{
    get name(): string;
    get connected(): boolean;

    connect(errorHandler: ErrorHandler): Promise<void>;
    disconnect(): Promise<void>;

    publish<T>(publication: Publication<T>): Promise<void>;
    subscribe<T>(subscription: Subscription<T>): Promise<void>;
    unsubscribe<T>(subscription: Subscription<T>): Promise<void>;
}
