
# Event Broker core | The Shelf

This package contains the publication / subscription model. It uses a interchangeable driver system for performing the actual operations. An in-memory driver is included.

## Installation

```bash
npm install @theshelf/eventbroker
```

## How to use

The basic set up looks like this.

```ts
import EventBroker, { MemoryDriver } from '@theshelf/eventbroker';

const driver = new MemoryDriver();
const eventBroker = new EventBroker(driver);

// Perform operations with the eventBroker instance
```

## Operations

```ts
import type { Publication, Subscription } from '@theshelf/eventbroker';

// Open connection
await eventBroker.connect();

// Close connection
await eventBroker.disconnect();

// Subscribe to an event
const subscription: Subscription = { channel: 'post', name: 'updated', handler: (postId: string) => { ... } };
await eventBroker.subscribe(subscription);

// Publish an event
const publication: Publication = { channel: 'post', name: 'updated', data: { postId: '123' } };
await eventBroker.publish(publication);

// Unsubscribe from an event
await eventBroker.unsubscribe(subscription);
```

## Types

The publication has the following structure.

```ts
type Publication<T> = {
    channel: string;
    name: string;
    data?: T
}
```

The subscription has the following structure.

```ts
type Subscription<T> = {
    channel: string;
    name: string;
    handler: EventHandler<T>;
}
```

Where the event handler performs an operation on the data of the publication.

```ts
type EventHandler<T> = (data: T) => void;
```

## Drivers

### Memory

In-memory event broker (suited for testing). It doesn't have any configuration options, but has an additional operation.

```ts
// Clear the memory
driver.clear();
```
