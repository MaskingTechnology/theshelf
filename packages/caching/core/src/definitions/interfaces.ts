
import type { CacheItem } from './types.js';

export interface Driver
{
    get name(): string;
    get connected(): boolean;

    connect(): Promise<void>;
    disconnect(): Promise<void>;
    
    get<T>(key: string): Promise<CacheItem<T> | undefined>;
    set<T>(item: CacheItem<T>): Promise<void>;
    delete(key: string): Promise<void>;
}
