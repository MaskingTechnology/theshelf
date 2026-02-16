
# Caching Redis driver | The Shelf

This package contains the driver implementation for the Redis key-value store. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/caching @theshelf/caching-driver-redis
```

## How to use

The basic set up looks like this.

```ts
import CacheStore from '@theshelf/caching';
import { RedisDriver } from '@theshelf/caching-driver-redis';

const driver = new RedisDriver({/* Configuration options */});
const cacheStore = new CacheStore(driver);

// Perform operations with the cacheStore instance
```

## Configuration options

```ts
type RedisConfiguration = {
    readonly url: string;
};
```
