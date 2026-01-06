
# Event Broker | The Shelf

The event broker package provides a universal interaction layer with an actual event broker solution.

This package is based on a publish / subscribe model.

## Installation

```bash
npm install @theshelf/eventbroker
```

## Driver

Currently, there is only one driver available:

* **Memory** - non-persistent event broker based on the Node.js `EventEmitter`.

We have plans to add a Kafka driver later on.

## How to use

The instance of the event broker needs to be imported and one of the drivers must be set.

```ts
import eventBroker, { MemoryDriver as SelectedDriver } from '@theshelf/eventbroker';

// Set the driver before performing any operation (the Memory driver is used by default)
eventBroker.driver = new SelectedDriver(/* configuration */);

// Perform operations with the eventBroker instance
```

### Configuration

The event broker instance does not have any configuration options.

#### Memory driver

No configuration options.

### Operations

```ts
import eventBroker, { Publication, Subscription } from '@theshelf/eventbroker';

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
