
# Caching core | The Shelf

This package contains the definition of the caching operations. It uses an interchangeable driver system for performing the actual operations. An in-memory driver is included.

## Installation

```bash
npm install @theshelf/caching
```

## How to use

The basic set up looks like this.

```ts
import CacheStore, { MemoryDriver } from '@theshelf/caching';

const driver = new MemoryDriver();
const cacheStore = new CacheStore(driver);

// Perform operations with the cacheStore instance
```

## Operations

```ts
// Open connection
await cacheStore.connect();

// Close connection
await cacheStore.disconnect();

// Cache a value
const key = 'unique-key';
const value = 'cache me'; // Can be any serializable value
const ttl = 10_000; // optional, time in milliseconds
await cacheStore.set(key, value, ttl);

// Get a cached value (or undefined if not found)
const key = 'unique-key';
await cacheStore.get(key);

// Delete a cached value
const key = 'unique-key';
await cacheStore.delete(key);
```

## Drivers

There is one driver included in this package. Other drivers are available in separate packages.

### Memory

In memory cache store (suited for testing).

It has one configuration option.

```ts
const defaultTTL = 60_000; // optional, time in milliseconds (default 60 seconds)
const driver = new MemoryDriver(defaultTTL);
```

It also has an additional operation.

```ts
// Clear the memory
driver.clear();
```
