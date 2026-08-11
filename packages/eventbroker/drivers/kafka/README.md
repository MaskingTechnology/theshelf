
# Event broker Kafka driver | The Shelf

This package contains the driver implementation for Kafka. This driver can be used by the [core package](../../core/README.md) for performing the actual operations.

## Installation

```bash
npm install @theshelf/eventbroker @theshelf/eventbroker-driver-kafka
```

## How to use

The basic set up looks like this.

```ts
import EventBroker from '@theshelf/eventbroker';
import { KafkaDriver } from '@theshelf/eventbroker-driver-kafka';

const driver = new KafkaDriver({/* Configuration options */});
const eventBroker = new EventBroker(driver);

// Publish and subscribe with the event broker
```

### Configuration options

```ts
type KafkaConfiguration = {
    readonly brokers: string[]; // e.g. http://my-kafka-cluster.local:9092
    readonly groupId: string; // e.g. prod.orders.payment-service
    readonly clientId: string;// e.g. prod.orders.payment-service.order-events-processor
};
```
